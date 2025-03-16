import Card from './Card'
import React, { useRef, useCallback } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useGetImageBaseURLQuery } from '../redux/apiSlice';
import { FALLBACK_IMAGE_BASE_URL, POSTER } from '../config/constants';

const HorizontalScrollCard = ({ cardsData = [], heading, trending, mediaType }) => {
    const containerRef = useRef(null);
    const { imageBaseURL } = useGetImageBaseURLQuery({ imageFor: POSTER}, {
        selectFromResult: ({ data, ...rest }) => ({
            imageBaseURL: (data || FALLBACK_IMAGE_BASE_URL),
            ...rest
        })
    });

    const scrollPrevious = useCallback(() => {
        if (containerRef.current) containerRef.current.scrollLeft -= 300;
    }, []);

    const scrollNext = useCallback(() => {
        if (containerRef.current) containerRef.current.scrollLeft += 300;
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (!containerRef.current) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                scrollPrevious();
                break;
            case 'ArrowRight':
                e.preventDefault();
                scrollNext();
                break;
            case 'Home':
                e.preventDefault();
                containerRef.current.scrollLeft = 0;
                break;
            case 'End':
                e.preventDefault();
                containerRef.current.scrollLeft = containerRef.current.scrollWidth;
                break;
        }
    }, [scrollPrevious, scrollNext]);

    return (
        <section className='container mx-auto my-10 px-3'>
            <h2 className='mb-2 text-xl font-bold capitalize text-white lg:text-2xl'>
                {heading}
            </h2>

            <div className='relative overflow-visible'>
                <div ref={containerRef}
                    role='list'
                    className='no-scrollbar relative grid grid-flow-col gap-6 overflow-y-visible overflow-x-scroll scroll-smooth transition-all'
                    style={{
                        gridTemplateColumns: `repeat(auto-fit, 14.5rem)`,
                        height: '348px',
                        willChange: 'transform'
                    }}
                    tabIndex="0"
                    onKeyDown={handleKeyDown}>
                    {cardsData.map((card, index) => (
                        <Card
                            data={card}
                            index={index + 1}
                            trending={trending}
                            mediaType={mediaType}
                            posterImageBaseURL={imageBaseURL}
                            key={card.id + "heading" + index}
                        />
                    ))}
                </div>

                <div className='pointer-events-none absolute top-0 hidden h-full w-full items-center justify-between lg:flex'>
                    <button
                        className='pointer-events-auto z-10 -ml-2 cursor-pointer rounded-full bg-white p-1 text-black focus:outline-none focus:ring-2 focus:ring-offset-2'
                        onClick={scrollPrevious}
                        aria-label="Scroll left"
                    >
                        <FaAngleLeft />
                    </button>
                    <button
                        className='pointer-events-auto z-10 -mr-2 cursor-pointer rounded-full bg-white p-1 text-black focus:outline-none focus:ring-2 focus:ring-offset-2'
                        onClick={scrollNext}
                        aria-label="Scroll right"
                    >
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default HorizontalScrollCard