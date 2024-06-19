import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

dotenv.config({ path: path.join(fileURLToPath(import.meta.url), "../.env") });

const { Pool } = pg;

const databaseUrl =
	process.env.NODE_ENV === "test"
		? process.env.TEST_DATABASE_URL ||
			"postgres://fallback_username:fallback_password@localhost:5432/fallback_test_db"
		: process.env.DATABASE_URL ||
			"postgres://fallback_username:fallback_password@localhost:5432/fallback_db";

const pool =
	databaseUrl &&
	new Pool({
		connectionString: databaseUrl,
		connectionTimeoutMillis: 5000,
		ssl:
			databaseUrl.includes("localhost") || databaseUrl.includes("flycast")
				? false
				: { rejectUnauthorized: false },
	});

export const connectDb = async () => {
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

export const disconnectDb = () => {
	if (!pool) {
		return;
	}
	pool.end();
};

export const query = async (...args) => {
	if (!pool) {
		throw new Error("Database pool not initialized");
	}
	const client = await pool.connect();
	try {
		return await client.query(...args);
	} finally {
		client.release();
	}
};

export default pool;
