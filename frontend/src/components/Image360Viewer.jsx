import React, { useState, useRef, useEffect } from 'react';

/**
 * 360° Image Viewer Component
 * Allows users to explore product images with drag-to-rotate functionality
 */
const Image360Viewer = ({ images = [], title = 'Product View' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [rotation, setRotation] = useState(0);
    const containerRef = useRef(null);

    // If only one image, show regular viewer
    if (images.length === 0) {
        return (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No images available</p>
            </div>
        );
    }

    if (images.length === 1) {
        return (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <img 
                    src={images[0]} 
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const sensitivity = 5; // Lower = more sensitive
        const newRotation = rotation + deltaX;

        setRotation(newRotation);
        setStartX(e.clientX);

        // Calculate which image to show based on rotation
        const imageIndex = Math.floor(
            ((newRotation % 360) + 360) % 360 / (360 / images.length)
        );
        setCurrentIndex(imageIndex);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;

        const deltaX = e.touches[0].clientX - startX;
        const newRotation = rotation + deltaX;

        setRotation(newRotation);
        setStartX(e.touches[0].clientX);

        const imageIndex = Math.floor(
            ((newRotation % 360) + 360) % 360 / (360 / images.length)
        );
        setCurrentIndex(imageIndex);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [isDragging, startX, rotation]);

    const rotateLeft = () => {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        setCurrentIndex(newIndex);
        setRotation(newIndex * (360 / images.length));
    };

    const rotateRight = () => {
        const newIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(newIndex);
        setRotation(newIndex * (360 / images.length));
    };

    return (
        <div className="relative w-full h-full">
            <div 
                ref={containerRef}
                className={`relative w-full h-full rounded-t-lg overflow-hidden bg-gray-900 ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {/* Current Image */}
                <img 
                    src={images[currentIndex]} 
                    alt={`${title} - View ${currentIndex + 1}`}
                    className="w-full h-full object-contain select-none"
                    draggable="false"
                />

                {/* 360° Indicator */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    360° View
                </div>

                {/* Instruction overlay (show only initially) */}
                {!isDragging && rotation === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-none">
                        <div className="bg-white/90 px-6 py-3 rounded-lg text-center">
                            <p className="text-sm font-semibold text-gray-800">Drag to rotate</p>
                            <p className="text-xs text-gray-600 mt-1">or use arrow buttons</p>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <button
                    onClick={rotateLeft}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    aria-label="Rotate left"
                >
                    <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={rotateRight}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    aria-label="Rotate right"
                >
                    <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Image360Viewer;
