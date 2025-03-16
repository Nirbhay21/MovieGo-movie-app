import React from 'react';

const BannerHomeSkeleton = React.memo(() => {
    return (
        <section className='h-full w-full' aria-busy="true" role="status">
            <span className="sr-only">Loading banner content...</span>

            <div className='flex max-h-[96vh] min-h-full'>
                {/* Banner Image */}
                <div className='relative h-[56.25vw] max-h-[96vh] min-h-[28rem] min-w-full lg:min-h-full'>
                    <div className='relative h-full w-full overflow-hidden bg-gray-800'>
                        <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800'></div>
                    </div>

                    {/* Skeleton Buttons for next and previous image */}
                    <div className='absolute top-0 hidden h-full w-full p-2 lg:flex lg:items-center lg:justify-between lg:p-4 lg:text-2xl'>
                        <div className='relative z-10 h-8 w-8 overflow-hidden rounded-full bg-gray-700'>
                            <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                        </div>
                        <div className='relative z-10 h-8 w-8 overflow-hidden rounded-full bg-gray-700'>
                            <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                        </div>
                    </div>

                    <div className='absolute top-0 h-full w-full bg-gradient-to-t from-neutral-900 to-transparent'></div>

                    <div className='container mx-auto'>
                        <div className='absolute bottom-0 mb-1 max-w-md px-3 lg:mb-2'>
                            <div className='relative mb-4 h-6 w-48 overflow-hidden bg-gray-700 lg:h-8'>
                                <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                            </div>
                            <div className='relative mb-2 h-4 w-[88vw] max-w-[26.5rem] overflow-hidden bg-gray-700 sm:w-[26.5rem] lg:mb-3'>
                                <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                            </div>
                            <div className='relative mb-2 h-4 w-[88vw] max-w-[26.5rem] overflow-hidden bg-gray-700 sm:w-[26.5rem] lg:mb-3'>
                                <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                            </div>
                            <div className='relative mb-2 h-4 w-[88vw] max-w-[26.5rem] overflow-hidden bg-gray-700 sm:w-[26.5rem] lg:mb-3'>
                                <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                            </div>
                            <div className='mt-4 flex space-x-4'>
                                <div className='relative h-4 w-24 overflow-hidden bg-gray-700'>
                                    <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                                </div>
                                <span className='h-4 w-1 bg-gray-700'></span>
                                <div className='relative h-4 w-[4.8rem] overflow-hidden bg-gray-700'>
                                    <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                                </div>
                            </div>
                            <div className='relative mt-4 h-10 w-32 overflow-hidden rounded-sm bg-gray-700'>
                                <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

export default BannerHomeSkeleton;

