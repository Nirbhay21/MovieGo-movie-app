import React from 'react';

const BannerImageSkeleton = () => (
    <div className='relative h-[56.25vw] max-h-[96vh] min-h-[28rem] min-w-full lg:min-h-full'>
        <div className='relative h-full w-full overflow-hidden bg-gray-800'>
            <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800'></div>
        </div>
        <div className='absolute top-0 h-full w-full bg-gradient-to-t from-neutral-900 to-transparent'></div>
    </div>
);

const BannerControlsSkeleton = () => (
    <div className='absolute top-0 hidden h-full w-full items-center justify-between p-2 lg:flex lg:p-4 lg:text-2xl' aria-hidden="true">
        <div className='relative z-10 h-8 w-8 overflow-hidden rounded-full bg-gray-700'>
            <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
        </div>
        <div className='relative z-10 h-8 w-8 overflow-hidden rounded-full bg-gray-700'>
            <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
        </div>
    </div>
);

const BannerContentSkeleton = () => (
    <div className='container mx-auto'>
        <div className='absolute bottom-0 mb-1 max-w-md px-3 lg:mb-2'>
            <div className='relative mb-4 h-6 w-48 overflow-hidden bg-gray-700 lg:h-8' aria-label="Loading title">
                <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
            </div>
            
            <div role="region" aria-label="Loading overview" className="space-y-2 lg:space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className='relative h-4 w-[88vw] max-w-[26.5rem] overflow-hidden bg-gray-700 sm:w-[26.5rem]'>
                        <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                    </div>
                ))}
            </div>

            <div className='mt-4 flex space-x-4' role="region" aria-label="Loading statistics">
                <div className='relative h-4 w-24 overflow-hidden bg-gray-700'>
                    <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                </div>
                <span className='h-4 w-1 bg-gray-700' aria-hidden="true"></span>
                <div className='relative h-4 w-[4.8rem] overflow-hidden bg-gray-700'>
                    <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                </div>
            </div>

            <div className='relative mt-4 h-10 w-32 overflow-hidden rounded-sm bg-gray-700' aria-label="Loading action button">
                <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
            </div>
        </div>
    </div>
);

const HomeBannerSkeleton = () => {
    return (
        <section 
            className='h-full w-full' 
            aria-busy="true" 
            role="status"
            aria-label="Loading featured banner"
        >
            <div 
                className='flex max-h-[96vh] min-h-full w-full'
                style={{ 
                    aspectRatio: '16/9',
                    minHeight: '28rem'
                }}
            >
                <div className="relative min-w-full">
                    <BannerImageSkeleton />
                    <BannerControlsSkeleton />
                    <BannerContentSkeleton />
                </div>
            </div>
            <div className="sr-only" aria-live="polite">Loading featured shows banner and content...</div>
        </section>
    );
};

export default HomeBannerSkeleton;
