import React from 'react';

const DetailsPageSkeleton = () => {
    return (
        <main aria-busy="true" role="status" className="animate-pulse">
            <span className="sr-only">Loading media details...</span>

            {/* Backdrop Image Skeleton */}
            <section className='relative hidden h-80 w-full lg:block'>
                <div className='relative h-full w-full overflow-hidden bg-gray-800'>
                    <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800'></div>
                </div>
                <div className='absolute top-0 h-full w-full bg-gradient-to-t from-neutral-900/90 to-transparent'></div>
            </section>

            {/* Content Section Skeleton */}
            <section className='container mx-auto flex flex-col gap-5 px-3 py-16 lg:flex-row lg:gap-10 lg:py-0'>
                {/* Poster Skeleton */}
                <div className='min-w-60 relative mx-auto w-fit lg:mx-0 lg:-mt-28'>
                    <div className='relative h-96 w-60 overflow-hidden bg-gray-700'>
                        <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                    </div>
                </div>

                {/* Text Content Skeleton */}
                <div className='w-full py-2'>
                    <div className='relative mb-4 h-6 w-48 overflow-hidden bg-gray-700 lg:h-8'>
                        <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                    </div>

                    <div className='relative mb-2 h-4 w-96 max-w-full overflow-hidden bg-gray-700'>
                        <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                    </div>

                    <div className='my-3 flex items-center gap-3'>
                        <div className='relative h-4 w-24 overflow-hidden bg-gray-700'>
                            <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                        </div>
                        <span className='h-4 w-1 bg-gray-700'></span>
                        <div className='relative h-4 w-16 overflow-hidden bg-gray-700'>
                            <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                        </div>
                    </div>

                    <div className='relative mt-4 h-6 w-36 overflow-hidden bg-gray-700'>
                        <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                    </div>

                    <div className='mt-6 grid grid-cols-[repeat(auto-fit,6rem)] justify-center gap-5'>
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className='flex flex-col items-center'>
                                <div className='relative h-24 w-24 overflow-hidden rounded-full bg-gray-700'>
                                    <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                                </div>
                                <div className='relative mt-2 h-4 w-20 overflow-hidden bg-gray-700'>
                                    <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default DetailsPageSkeleton;