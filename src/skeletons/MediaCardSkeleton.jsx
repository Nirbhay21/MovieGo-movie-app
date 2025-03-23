import React from 'react';

const PosterSkeleton = () => (
    <div 
        className='relative h-full w-full overflow-hidden bg-gray-700'
        aria-label="Loading poster image"
        style={{ 
            contentVisibility: 'auto',
            containIntrinsicSize: '232px 348px'
        }}
    >
        <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
    </div>
);

const TrendingBadgeSkeleton = () => (
    <div className='absolute top-4' aria-hidden="true">
        <div className='h-7 w-32 animate-pulse rounded-r-full bg-gray-900 backdrop-blur-3xl'></div>
    </div>
);

const ContentSkeleton = () => (
    <div className='absolute bottom-0 h-16 w-full bg-black/60 p-2.5 backdrop-blur-3xl'>
        <div 
            className='mb-2.5 h-5 w-40 animate-pulse rounded bg-gray-700'
            aria-label="Loading title"
        ></div>
        <div 
            className='flex justify-between text-sm text-neutral-400'
            role="group"
            aria-label="Loading media details"
        >
            <div 
                className='h-4 w-24 animate-pulse rounded bg-gray-700'
                aria-label="Loading release date"
            ></div>
            <div 
                className='h-4 w-16 animate-pulse rounded-full bg-gray-700'
                aria-label="Loading rating"
            ></div>
        </div>
    </div>
);

const MediaCardSkeleton = ({ trending }) => {
    return (
        <article 
            className='relative h-[348px] w-[232px] overflow-hidden rounded bg-gray-800'
            role="article"
            aria-busy="true"
            aria-label="Loading media card"
        >
            <div 
                className='block h-[348px] w-[232px]'
                style={{
                    width: 232,
                    height: 348
                }}
            >
                <PosterSkeleton />
                {trending && <TrendingBadgeSkeleton />}
                <ContentSkeleton />
            </div>
            <div className="sr-only" aria-live="polite">
                Loading media card content...
            </div>
        </article>
    );
};

export default MediaCardSkeleton;