// server.js

import http from "node:http";
import { connectDb, disconnectDb } from "./db.js"; // Correct import statement

import app from "./app.js";

const server = http.createServer(app);
const port = parseInt(process.env.PORT ?? "3000", 10);

server.on("listening", () => {
	const addr = server.address();
	const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
	console.log(`listening on: ${bind}`);
});

process.on("SIGTERM", () => server.close(() => disconnectDb()));

connectDb().then(() => server.listen(port));
