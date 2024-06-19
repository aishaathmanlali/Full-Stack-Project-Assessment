// components/VideoForm.js
import { useState } from "react";
import axios from "axios";

const VideoForm = ({ addVideo }) => {
	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (title && url) {
            const embedUrl = convertToEmbedUrl(url);
            if (embedUrl) {
                addVideo({ title, src: embedUrl });
                setTitle('');
                setUrl('');
            } else {
                alert('Invalid YouTube URL. Please try again.');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    const convertToEmbedUrl = (url) => {
        const videoIdMatch = url.match(
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        if (videoIdMatch) {
            return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        } else {
            throw new Error('Invalid YouTube URL');
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
