import React from 'react';

const MediaCardSkeleton = React.memo(({ trending }) => {
    return (
        <div
            className='relative block h-[348px] w-[232px] overflow-hidden rounded bg-gray-800'
            style={{ willChange: 'transform' }}
        >
            <div className='relative h-full w-full overflow-hidden bg-gray-700'>
                <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
            </div>
            {(trending) && (
                <div className='absolute top-4'>
                    <div className='h-7 w-32 animate-pulse rounded-r-full bg-gray-900'></div>
                </div>
            )}
            <div className='absolute bottom-0 h-16 w-full bg-black/60 p-2.5 backdrop-blur-3xl'>
                <div className='mb-2.5 h-5 w-40 animate-pulse rounded bg-gray-700'></div>
                <div className='flex justify-between text-sm text-neutral-400'>
                    <div className='h-4 w-24 animate-pulse rounded bg-gray-700'></div>
                    <div className='h-4 w-16 animate-pulse rounded-full bg-gray-700'></div>
                </div>
            </div>
        </div>
    );
});

export default MediaCardSkeleton;