// Videos.jsx

import React, { useEffect, useState } from "react";
import VideoForm from "./VideoForm";

const Videos = () => {
	const [videos, setVideos] = useState([]);

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const response = await fetch("/api/videos");
				const data = await response.json();
				setVideos(data.videos);
			} catch (error) {
				console.error("Error fetching videos:", error);
			}
		};

		fetchVideos();
	}, []);

	const updateRating = async (id, rating) => {
		try {
			const response = await fetch(`/api/videos/${id}/rating`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ rating }),
			});

			if (response.ok) {
				const updatedVideo = await response.json();
				setVideos((prevVideos) =>
					prevVideos.map((video) =>
						video.id === updatedVideo.id ? updatedVideo : video
					)
				);
			} else {
				console.error("Failed to update rating");
			}
		} catch (error) {
			console.error("Error updating rating:", error);
		}
	};

	return (
		<div>
			<h2>Video List</h2>
			<VideoForm />
			<ul>
				{videos.map((video) => (
					<li key={video.id}>
						<div>
							<iframe
								width="560"
								height="315"
								src={video.src}
								title={video.title}
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							></iframe>
							<p>{video.title}</p>
							<div>
								<button onClick={() => updateRating(video.id, "thumbsUp")}>
									Thumbs Up
								</button>
								<button onClick={() => updateRating(video.id, "thumbsDown")}>
									Thumbs Down
								</button>
								<p>Rating: {video.rating || "Not rated yet"}</p>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Videos;
