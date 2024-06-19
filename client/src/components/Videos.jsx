import { useEffect, useState } from "react";
import VideoForm from "./VideoForm";

const Videos = () => {
	const [videos, setVideos] = useState([]);

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const response = await fetch("/api/videos");
				const data = await response.json();
				setVideos(data.videos);
				console.log(data);
			} catch (error) {
				console.error("Error fetching videos:", error);
			}
		};

		fetchVideos();
	}, []);

	const addVideo = (video) => {
		setVideos((prevVideos) => [...prevVideos, video]);
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
			} else {
				console.error("Failed to delete video");
			}
		} catch (error) {
			console.error("Error deleting video:", error);
		}
	};

	return (
		<div>
			<h2>Video List</h2>
			<VideoForm addVideo={addVideo} />

<<<<<<< HEAD
    const deleteVideo = (index) => {
        setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
    };





    return (
        <div>

            <h2> Video List</h2>
            <VideoForm addVideo={addVideo} />
            
            <ul>
                {videos.map((video, index) => (
                    <li key={index}>

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
                        <button onClick={() => deleteVideo(index)}>Excluir</button>
                    </div>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
=======
			<ul>
				{videos.map((video) => (
					<li key={video.id}>
						<a href={video.src} target="_blank" rel="noopener noreferrer">
							{video.title}
						</a>
						<button onClick={() => deleteVideo(video.id)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
>>>>>>> main
};

export default Videos;
