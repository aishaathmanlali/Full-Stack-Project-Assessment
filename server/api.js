import { Router } from "express";
import pool from "./db.js";

const router = Router();

// Get all videos
router.get("/videos", async (_, res) => {
	try {
		const result = await pool.query("SELECT * FROM videos");
		res.status(200).json({ videos: result.rows });
	} catch (error) {
		console.error("Error fetching videos:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Delete a specific video by ID
router.delete("/videos/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const deleteResult = await pool.query("DELETE FROM videos WHERE id = $1", [
			id,
		]);
		if (deleteResult.rowCount === 0) {
			return res.status(404).json({ error: "Video not found" });
		}
		res.status(204).send();
	} catch (error) {
		console.error("Error deleting video:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Add new video
router.post("/videos", async (req, res) => {
	const { title, src } = req.body;

	if (!title || !src) {
		return res.status(400).json({ error: "Missing required video data" });
	}

	try {
		const insertResult = await pool.query(
			"INSERT INTO videos (title, src) VALUES ($1, $2) RETURNING *",
			[title, src]
		);

		const newVideo = insertResult.rows[0];
		res.status(201).json(newVideo);
	} catch (error) {
		console.error("Error adding new video:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Update video rating
router.put("/videos/:id/rating", async (req, res) => {
	const { id } = req.params;
	const { rating } = req.body;

	if (typeof rating !== "number" || rating < 0) {
		return res.status(400).json({ error: "Invalid rating value" });
	}

	console.log(`Updating rating for video ID ${id} to new rating ${rating}`); // Debug log

	try {
		const updateResult = await pool.query(
			"UPDATE videos SET rating = $1 WHERE id = $2 RETURNING *",
			[rating, id]
		);

		if (updateResult.rows.length === 0) {
			return res.status(404).json({ error: "Video not found" });
		}

		const updatedVideo = updateResult.rows[0];
		console.log(`Updated video in DB:`, updatedVideo); // Debug log
		res.status(200).json(updatedVideo);
	} catch (error) {
		console.error("Error updating video rating:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
