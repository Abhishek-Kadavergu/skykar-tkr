import React, { useState } from 'react';

/**
 * Video Preview Component
 * Shows video previews with play overlay
 * Supports YouTube, direct URLs, and preview clips
 */
const VideoPreview = ({ videoUrl, thumbnail, title = 'Video', autoPlay = false }) => {
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [showPlayer, setShowPlayer] = useState(false);

    if (!videoUrl) {
        return null;
    }

    // Extract YouTube video ID if it's a YouTube URL
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYouTubeId(videoUrl);
    const isYouTube = !!youtubeId;

    const handlePlay = () => {
        setIsPlaying(true);
        setShowPlayer(true);
    };

    return (
        <div className="relative w-full h-56 sm:h-64 lg:h-80 rounded-lg overflow-hidden bg-black group">
            {!showPlayer ? (
                // Thumbnail with play button
                <>
                    <img 
                        src={thumbnail || (isYouTube ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : '/placeholder-video.jpg')}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all">
                        <button
                            onClick={handlePlay}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 sm:p-6 shadow-2xl transform hover:scale-110 transition-all"
                            aria-label="Play video"
                        >
                            <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                    </div>

                    {/* Video duration badge (if available) */}
                    <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold">
                        ▶ Video
                    </div>
                </>
            ) : (
                // Video player
                <div className="relative w-full h-full">
                    {isYouTube ? (
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                            title={title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            className="w-full h-full"
                            controls
                            autoPlay
                            src={videoUrl}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                    
                    {/* Close button */}
                    <button
                        onClick={() => {
                            setShowPlayer(false);
                            setIsPlaying(false);
                        }}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-2 z-10"
                        aria-label="Close video"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

/**
 * Multiple Videos Gallery Component
 */
export const VideoGallery = ({ videos = [], title = 'Videos' }) => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    if (videos.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            
            {selectedVideo ? (
                <VideoPreview 
                    videoUrl={selectedVideo.url}
                    thumbnail={selectedVideo.thumbnail}
                    title={selectedVideo.title}
                    autoPlay={true}
                />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {videos.map((video, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedVideo(video)}
                            className="relative group rounded-lg overflow-hidden aspect-video"
                        >
                            <img 
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
                                <div className="bg-white/90 rounded-full p-3">
                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                            {video.duration && (
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-0.5 rounded text-xs font-semibold">
                                    {video.duration}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {selectedVideo && (
                <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                    ← Back to gallery
                </button>
            )}
        </div>
    );
};

export default VideoPreview;
