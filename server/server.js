import express from "express";
import { connectDb, disconnectDb } from "./db.js"; // Correct import statement
import apiRouter from "./api.js";


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", apiRouter);

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});

// Start server
const startServer = async () => {
	try {
		await connectDb(); // Connect to database
		app.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}`);
		});
	} catch (error) {
		console.error("Error starting server:", error);
		process.exit(1); // Exit process on error
	}
};

// Start server
startServer();

// Handle graceful shutdown
process.on("SIGINT", async () => {
	try {
		await disconnectDb(); // Disconnect from database
		process.exit(0);
	} catch (error) {
		console.error("Error shutting down server:", error);
		process.exit(1);
	}
});
