import React, { useRef } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import MediaCardSkeleton from './MediaCardSkeleton';

const HorizontalScrollCardSkeleton = React.memo(({trending}) => {
    const containerRef = useRef(null);

    const scrollPrevious = () => {
        containerRef.current.scrollLeft -= 300;
    }

    const scrollNext = () => {
        containerRef.current.scrollLeft += 300;
    }

    return (
        <div className='container mx-auto my-10 px-3'>
            <div className='w-42 relative mb-2.5 h-6 animate-pulse overflow-hidden rounded bg-gray-600 lg:h-8 lg:w-48'>
                <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600'></div>
            </div>
            <div className='relative'>
                <div
                    ref={containerRef}
                    className='no-scrollbar relative grid grid-flow-col gap-6 overflow-x-scroll scroll-smooth transition-all'
                    style={{
                        gridTemplateColumns: `repeat(auto-fit, 14.5rem)`,
                        height: '348px',
                        willChange: 'transform'
                    }}
                >
                    {[...Array(20)].map((_, index) => (
                        <MediaCardSkeleton key={index} trending={trending}/>
                    ))}
                </div>

                <div className='pointer-events-none absolute top-0 hidden h-full w-full items-center justify-between lg:flex'>
                    <button className='text- pointer-events-auto z-10 -ml-2 cursor-pointer rounded-full bg-neutral-500 p-1 text-neutral-800' onClick={scrollPrevious}>
                        <FaAngleLeft />
                    </button>
                    <button className='text- pointer-events-auto z-10 -mr-2 cursor-pointer rounded-full bg-neutral-500 p-1 text-neutral-800' onClick={scrollNext}>
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </div>
    );
});

export default HorizontalScrollCardSkeleton;
