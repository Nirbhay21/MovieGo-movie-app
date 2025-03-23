import Card from './Card'
import React, { useRef, useCallback, useMemo } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useGetImageBaseURLQuery } from '../redux/apiSlice';
import { FALLBACK_IMAGE_BASE_URL, POSTER } from '../config/constants';

const STYLE_CONSTANTS = {
    section: 'container mx-auto my-10 px-3',
    heading: 'mb-2 text-xl font-bold capitalize text-white lg:text-2xl',
    container: 'no-scrollbar relative grid grid-flow-col gap-6 overflow-y-visible overflow-x-scroll scroll-smooth transition-all',
    buttonContainer: 'pointer-events-none absolute top-0 hidden h-full w-full items-center justify-between lg:flex',
    buttonBase: 'pointer-events-auto z-10 cursor-pointer rounded-full bg-white p-2 text-black shadow-lg transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800',
    buttonLeft: '-ml-2',
    buttonRight: '-mr-2',
    iconStyle: 'h-5 w-5'
};

const ScrollButton = React.memo(({ direction, onClick, heading }) => (
    <button
        className={`${STYLE_CONSTANTS.buttonBase} ${direction === 'left' ? STYLE_CONSTANTS.buttonLeft : STYLE_CONSTANTS.buttonRight}`}
        onClick={onClick}
        aria-label={`Scroll ${direction} in ${heading}`}
    >
        {direction === 'left' ? (
            <FaAngleLeft className={STYLE_CONSTANTS.iconStyle} aria-hidden="true" />
        ) : (
            <FaAngleRight className={STYLE_CONSTANTS.iconStyle} aria-hidden="true" />
        )}
    </button>
));

ScrollButton.displayName = 'ScrollButton';

const HorizontalScrollCard = ({ cardsData = [], heading, trending, mediaType }) => {
    const containerRef = useRef(null);
    const { imageBaseURL } = useGetImageBaseURLQuery({ imageFor: POSTER}, {
        selectFromResult: ({ data, ...rest }) => ({
            imageBaseURL: (data || FALLBACK_IMAGE_BASE_URL),
            ...rest
        })
    });

    const containerStyles = useMemo(() => ({
        gridAutoColumns: '14.5rem',
        height: '348px',
        willChange: 'transform',
        touchAction: 'pan-x pan-y pinch-zoom'
    }), []);

    const filteredCards = useMemo(() =>
        cardsData.filter(card => card.poster_path),
    [cardsData]);

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
        <section className={STYLE_CONSTANTS.section}>
            <h2 className={STYLE_CONSTANTS.heading}>
                {heading}
            </h2>

            <div className='relative overflow-visible'>
                <div ref={containerRef}
                    role='list'
                    className={STYLE_CONSTANTS.container}
                    style={containerStyles}
                    tabIndex="0"
                    onKeyDown={handleKeyDown}
                    aria-label={`Scrollable ${heading} content`}
                    aria-description="Use arrow keys to scroll left and right, Home to scroll to start, End to scroll to end">
                    {useMemo(() => (
                        filteredCards.map((card, index) => (
                            <div role="listitem" key={card.id + "heading" + index} className="-m-2 overflow-visible p-2 hover:z-10">
                                <Card
                                    data={card}
                                    index={index + 1}
                                    trending={trending}
                                    mediaType={mediaType}
                                    posterImageBaseURL={imageBaseURL}
                                />
                            </div>
                        ))
                    ), [filteredCards, trending, mediaType, imageBaseURL])}
                </div>

                <div className={STYLE_CONSTANTS.buttonContainer}>
                    <ScrollButton direction="left" onClick={scrollPrevious} heading={heading} />
                    <ScrollButton direction="right" onClick={scrollNext} heading={heading} />
                </div>
            </div>
        </section>
    )
}

export default React.memo(HorizontalScrollCard, (prevProps, nextProps) => {
    return (
        prevProps.heading === nextProps.heading &&
        prevProps.trending === nextProps.trending &&
        prevProps.mediaType === nextProps.mediaType &&
        prevProps.cardsData === nextProps.cardsData
    );
});