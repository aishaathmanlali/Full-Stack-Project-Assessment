// components/VideoForm.js
import { useState } from "react";
import axios from "axios";

const VideoForm = ({ addVideo }) => {
	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault(); 
		if (title && url) {
			try {
				const response = await axios.post("/api/videos", { title, src: url });
				addVideo(response.data); 
				setTitle("");
				setUrl("");
			} catch (error) {
				console.error("Error adding video:", error);
			}
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Title:</label>
				<input
					type="text"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder="Type your video"
					required
				/>
			</div>
			<div>
				<label>YouTube URL:</label>
				<input
					type="url"
					value={url}
					onChange={(event) => setUrl(event.target.value)}
					placeholder="URL"
					required
				/>
			</div>
			<button type="submit">Add New Video</button>
		</form>
	);
};

export default VideoForm;
