import React from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import MediaCardSkeleton from './MediaCardSkeleton';

const HeaderSkeleton = () => (
    <div className='w-42 relative mb-2.5 h-6 overflow-hidden rounded bg-gray-600 lg:h-8 lg:w-48' role="heading" aria-level="2" aria-label="Loading section title">
        <div className='animate-skeleton-diagonal absolute inset-0 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600'></div>
    </div>
);

const ScrollControlsSkeleton = () => (
    <div className='pointer-events-none absolute top-0 hidden h-full w-full items-center justify-between lg:flex' role="group" aria-label="Scroll controls">
        <div className='z-10 -ml-2 rounded-full bg-neutral-500 p-1 text-neutral-800' aria-hidden="true">
            <FaAngleLeft />
        </div>
        <div className='z-10 -mr-2 rounded-full bg-neutral-500 p-1 text-neutral-800' aria-hidden="true">
            <FaAngleRight />
        </div>
    </div>
);

const CardListSkeleton = ({ trending }) => {
    // Show fewer cards in skeleton state for better performance
    const skeletonCount = 8;

    return (
        <div 
            className='no-scrollbar relative grid grid-flow-col gap-6 overflow-x-scroll scroll-smooth transition-all'
            style={{
                gridTemplateColumns: `repeat(${skeletonCount}, 14.5rem)`,
                height: '348px'
            }}
            role="list"
            aria-label="Loading media cards"
        >
            {Array.from({ length: skeletonCount }).map((_, index) => (
                <div key={index} role="listitem">
                    <MediaCardSkeleton trending={trending} />
                </div>
            ))}
        </div>
    );
};

const HorizontalScrollCardSkeleton = ({ trending }) => {
    return (
        <section 
            className='container mx-auto my-10 px-3'
            aria-busy="true"
            role="region"
            aria-label="Loading media section"
        >
            <HeaderSkeleton />
            
            <div className='relative overflow-visible'>
                <CardListSkeleton trending={trending} />
                <ScrollControlsSkeleton />
            </div>

            <div className="sr-only" aria-live="polite">
                Loading media content, please wait...
            </div>
        </section>
    );
};

export default HorizontalScrollCardSkeleton;
