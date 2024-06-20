import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

dotenv.config({ path: path.join(fileURLToPath(import.meta.url), "../.env") });

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not defined in the environment variables");
}

const pool = new Pool({
	connectionString: databaseUrl,
	connectionTimeoutMillis: 5000,
	ssl:
		databaseUrl.includes("localhost") || databaseUrl.includes("flycast")
			? false
			: { rejectUnauthorized: false },
});

pool.on("connect", () => {
	console.log(`Connected to PostgreSQL database`);
});

pool.on("error", (err) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

const connectDb = async () => {
	if (!pool) {
		return;
	}

	let client;
	try {
		client = await pool.connect();
		console.log(`Postgres connected to ${client.database}`);
	} catch (err) {
		console.error("Error connecting to Postgres:", err);
		throw err;
	} finally {
		client && client.release();
	}
};

const disconnectDb = () => {
	if (!pool) {
		return;
	}
	pool.end();
};

export { connectDb, disconnectDb, pool as default };
