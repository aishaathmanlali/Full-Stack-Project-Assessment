// api.js

import express from "express";
import { query, connectDb, disconnectDb } from "./db.js";

const router = express.Router();

// Example route using query function
router.put("/videos/:id/rating", async (req, res, next) => {
	const { id } = req.params;
	const { rating } = req.body;

	try {
		const updateQuery = `
      UPDATE videos
      SET rating = $1
      WHERE id = $2
      RETURNING id, title, src, rating
    `;
		const result = await pool.query(updateQuery, [rating, id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Video not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating video rating:", error);
		next(error);
	}
});

export default router;
