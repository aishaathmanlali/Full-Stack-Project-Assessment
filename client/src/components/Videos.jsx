import { useEffect, useState } from 'react';
import VideoForm from './VideoForm';


const Videos = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('/api/videos');
                const data = await response.json();
                setVideos(data.videos);
                console.log(data)
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchVideos();
    }, []);


    const addVideo = (video) => {
        setVideos((prevVideos) => [...prevVideos, video]);
    };



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
};

export default Videos;
