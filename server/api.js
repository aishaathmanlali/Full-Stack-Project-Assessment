import { Router } from "express";
import db from "./db.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

//Get all videos
router.get("/videos", async (_, res) => {
	console.log("api videos");
	db.query("SELECT * FROM videos")
		.then((result) => {
			//console.log(result);
			res.status(200).json({ videos: result.rows });
		})
		.catch((error) => {
			console.log(error);
		});
});

// Delete a specific video by ID
router.delete("/videos/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const selectResult = await db.query("SELECT * FROM videos WHERE id = $1", [
			id,
		]);
		//checks if video doesn't exist
		if (selectResult.rows.length === 0) {
			console.log("Video not found for ID:", id);
			return res.status(404).json({ error: "Video not found" });
		}

		// Delete the video
		const deleteResult = await db.query("DELETE FROM videos WHERE id = $1", [
			id,
		]);
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

	const id = uuidv4(); // Generate a unique ID for the new video

	try {
		const insertResult = await db.query(
			"INSERT INTO videos (id, title, src) VALUES ($1, $2, $3) RETURNING id",
			[id, title, src]
		);

		res.status(201).json({ id: insertResult.rows[0].id });
	} catch (error) {
		console.error("Error adding new video:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});


export default router;
