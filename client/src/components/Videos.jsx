// Videos.jsx
import React, { useEffect, useState } from "react";
import VideoForm from "./VideoForm";

const Videos = () => {
	const [videos, setVideos] = useState([]);
	const [order, setOrder] = useState(""); // Added state for ordering
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				let url = "/api/videos";
				if (order) {
					url += `?order=${order}`;
				}
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`Failed to fetch videos: ${response.status}`);
				}
				const data = await response.json();
				setVideos(data.videos);
			} catch (error) {
				console.error("Error fetching videos:", error);
				setError("Error fetching videos. Please try again later.");
			}
		};

		fetchVideos();
	}, [order]); // Added order as a dependency to refetch videos on change

	const addVideo = (video) => {
		setVideos((prevVideos) => [...prevVideos, video]);
	};

	const updateVideoRating = async (id, newRating) => {
		try {
			console.log(`Updating video ID ${id} with new rating ${newRating}`); // Debug log
			const response = await fetch(`/api/videos/${id}/rating`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ rating: newRating }),
			});

			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(
					`Failed to update video rating: ${response.status} - ${errorMessage}`
				);
			}

			const updatedVideo = await response.json();
			console.log(`Updated video:`, updatedVideo); // Debug log
			setVideos((prevVideos) =>
				prevVideos.map((video) =>
					video.id === id ? { ...video, rating: updatedVideo.rating } : video
				)
			);
		} catch (error) {
			console.error("Error updating video rating:", error);
			setError("Error updating video rating. Please try again later.");
		}
	};

	const deleteVideo = async (id) => {
		try {
			const response = await fetch(`/api/videos/${id}`, {
				method: "DELETE",
			});

			if (response.status === 204) {
				setVideos((prevVideos) =>
					prevVideos.filter((video) => video.id !== id)
				);
			} else if (response.status === 404) {
				console.error("Video not found");
				setError("Video not found.");
			} else {
				console.error("Failed to delete video");
				setError("Failed to delete video. Please try again later.");
			}
		} catch (error) {
			console.error("Error deleting video:", error);
			setError("Error deleting video. Please try again later.");
		}
	};

	const handleThumbsUp = (id, currentRating) => {
		console.log(currentRating);
		const newRating = Number(currentRating) + 1;
		console.log(
			`Thumbs Up for video ID ${id} with current rating ${currentRating} and new rating ${newRating}`
		); // Debug log
		updateVideoRating(id, newRating);
	};

	const handleThumbsDown = (id, currentRating) => {
		const newRating = Number(currentRating) - 1;
		console.log(
			`Thumbs Down for video ID ${id} with current rating ${currentRating} and new rating ${newRating}`
		); // Debug log
		updateVideoRating(id, newRating);
	};

	return (
		<div>
			<h2>Video List</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<VideoForm addVideo={addVideo} />

			<label htmlFor="order">Order By Rating: </label>
			<select
				id="order"
				value={order}
				onChange={(e) => setOrder(e.target.value)}
			>
				<option value="">Default (by ID)</option>
				<option value="asc">Ascending</option>
				<option value="desc">Descending</option>
			</select>

			<ul>
				{videos.map((video, index) => (
					<li key={index}>
						<div>
							<h3>{video.title}</h3>
							<div>
								<iframe
									width="560"
									height="315"
									src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.src)}`}
									title={video.title}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							</div>
							<button onClick={() => deleteVideo(video.id)}>Delete</button>
							<button onClick={() => handleThumbsUp(video.id, video.rating)}>
								Thumbs Up
							</button>
							<button onClick={() => handleThumbsDown(video.id, video.rating)}>
								Thumbs Down
							</button>
							<p>Rating: {video.rating}</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

const getYouTubeVideoId = (url) => {
	const videoId = url.split("v=")[1];
	return videoId ? videoId.split("&")[0] : "";
};

export default Videos;
