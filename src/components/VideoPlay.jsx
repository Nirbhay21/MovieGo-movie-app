import React, { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { useGetMediaVideosQuery } from '../redux/apiSlice';

const VideoPlay = ({ data, mediaType, close }) => {
    const { data: videosData, isLoading, isError } = useGetMediaVideosQuery({
        mediaId: data.id,
        mediaType
    });

    const modalRef = useRef(null);
    const iframeContainerRef = useRef(null);

    // Handle escape key press and scroll lock
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') close();
        };

        // Lock scroll
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [close]);

    // Focus trap
    useEffect(() => {
        const prevActiveElement = document.activeElement;
        if (modalRef.current) modalRef.current.focus();

        return () => {
            if (prevActiveElement) prevActiveElement.focus();
        };
    }, []);

    // Get the best trailer or video
    const videoKey = React.useMemo(() => {
        if (!videosData?.results?.length) return null;

        // Try to find official Hindi trailer first
        const hindiTrailer = videosData.results.find(
            video => video.type === 'Trailer' && video.official && video.site === 'YouTube' &&
            (video.name?.toLowerCase().includes('hindi') || video.name?.toLowerCase().includes('हिंदी'))
        );

        // Fall back to any Hindi trailer
        const anyHindiTrailer = videosData.results.find(
            video => video.type === 'Trailer' && video.site === 'YouTube' &&
            (video.name?.toLowerCase().includes('hindi') || video.name?.toLowerCase().includes('हिंदी'))
        );

        // Fall back to official English trailer
        const officialTrailer = videosData.results.find(
            video => video.type === 'Trailer' && video.official && video.site === 'YouTube'
        );

        // Fall back to any trailer
        const anyTrailer = videosData.results.find(
            video => video.type === 'Trailer' && video.site === 'YouTube'
        );

        // Fall back to any video
        const anyVideo = videosData.results.find(
            video => video.site === 'YouTube'
        );

        return hindiTrailer?.key || anyHindiTrailer?.key || officialTrailer?.key || anyTrailer?.key || anyVideo?.key;
    }, [videosData]);

    return (
        <div
            className='animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
            onClick={(e) => e.target === e.currentTarget && close()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-title"
            aria-describedby="video-description"
        >
            <div
                ref={modalRef}
                className='animate-scaleIn relative mx-4 aspect-video w-full max-w-5xl rounded-lg bg-black shadow-xl'
                tabIndex={-1}
            >
                <button
                    className='absolute -right-0 -top-8 rounded-full bg-gray-700 p-1.5 text-white transition-all hover:scale-110 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white active:scale-95 active:bg-gray-800 sm:-top-10'
                    onClick={close}
                    aria-label="Close video player"
                >
                    <IoClose className='text-lg sm:text-2xl' />
                </button>

                <div id="video-description" className="sr-only">
                    {`Video player for ${data.title || data.name}`}
                </div>

                {isLoading && (
                    <div className="flex h-full items-center justify-center" aria-label="Loading video">
                        <div className="relative h-12 w-12">
                            <div className="absolute inset-0 animate-ping rounded-full border-4 border-blue-500 opacity-75"></div>
                            <div className="relative h-12 w-12 animate-spin rounded-full border-4 border-neutral-300 border-t-blue-500"></div>
                        </div>
                    </div>
                )}

                {isError && (
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center text-white">
                        <p className="text-lg">Failed to load video</p>
                        <p className="text-sm text-neutral-400">Please check your connection and try again</p>
                        <button
                            onClick={close}
                            className="rounded-full bg-red-600 px-6 py-2 text-sm font-medium transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Close
                        </button>
                    </div>
                )}

                {videoKey && (
                    <div
                        ref={iframeContainerRef}
                        className="h-full w-full"
                        data-youtube-video-container="true"
                        style={{ touchAction: 'pan-x pan-y' }}
                    >
                        <iframe
                            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&controls=1&modestbranding=1&fs=1&playsinline=1&enablejsapi=1&wmode=transparent`}
                            className='h-full w-full rounded-lg'
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                            title={`${data.title || data.name} trailer`}
                            id="video-title"
                            loading="lazy"
                        />
                    </div>
                )}

                {!isLoading && !isError && !videoKey && (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-white">
                        <p className="text-lg">No video available</p>
                        <p className="text-sm text-neutral-400">This content doesn't have any videos yet</p>
                        <button
                            onClick={close}
                            className="mt-4 rounded-full bg-neutral-600 px-6 py-2 text-sm font-medium transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlay;