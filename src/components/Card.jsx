import React, { useMemo } from 'react'
import { Link } from 'react-router-dom';
import { formatReleaseDate } from '../config/utilityFunctions';

const CARD_DIMENSIONS = {
    width: 232,
    height: 348
};

const STYLE_CONSTANTS = {
    cardBase: 'relative overflow-hidden rounded transition hover:scale-[1.025]',
    linkBase: 'block focus:outline-none focus:ring focus:ring-white focus:ring-offset-1',
    trendingBadge: 'overflow-hidden rounded-r-full bg-black/50 px-4 py-1 backdrop-blur-3xl',
    infoOverlay: 'absolute bottom-0 h-16 w-full bg-black/60 p-2 backdrop-blur-3xl',
    rating: 'rounded-full bg-black px-2 py-0.5 text-xs text-neutral-100'
};

const TrendingBadge = React.memo(({ index }) => (
    <div className={STYLE_CONSTANTS.trendingBadge} role="status" aria-label={`Trending at position ${index}`}>
        #{index} Trending
    </div>
));

const Rating = React.memo(({ value }) => {
    const ratingValue = Number(value).toFixed(1);
    return (
        <div
            className={STYLE_CONSTANTS.rating}
            role="meter"
            aria-label={`Rating: ${ratingValue} out of 10`}
            aria-valuenow={ratingValue}
            aria-valuemin="0"
            aria-valuemax="10"
        >
            Rating: {ratingValue}
        </div>
    );
});

const ReleaseDate = React.memo(({ date, formattedDate }) => (
    <time
        dateTime={date}
        aria-label={`Released on ${formattedDate}`}
        className="text-neutral-400"
    >
        {formattedDate}
    </time>
));

const PosterImage = React.memo(({ src, alt }) => (
    <img
        src={src}
        loading='lazy'
        decoding='async'
        width={CARD_DIMENSIONS.width}
        height={CARD_DIMENSIONS.height}
        alt={alt}
        className='h-full w-full object-cover'
        style={{
            contentVisibility: 'auto',
            containIntrinsicSize: `${CARD_DIMENSIONS.width}px ${CARD_DIMENSIONS.height}px`
        }}
    />
));

const Card = React.memo(({ data, trending, index, mediaType, posterImageBaseURL }) => {
    const {
        id,
        poster_path,
        title,
        name,
        release_date,
        first_air_date,
        vote_average,
        media_type: dataMediaType
    } = data;

    const media_type = dataMediaType || mediaType;
    const displayName = title || name;
    const releaseDate = release_date || first_air_date;

    const linkTo = useMemo(() => `/${media_type}/${id}`, [media_type, id]);
    const formattedReleaseDate = useMemo(
        () => formatReleaseDate(releaseDate),
        [releaseDate]
    );

    const mediaDescription = useMemo(() => (
        `${displayName}. ${formattedReleaseDate ? `Released on ${formattedReleaseDate}.` : ''} ${Number(vote_average) > 0 ? `Rated ${Number(vote_average).toFixed(1)} out of 10.` : ''}`
    ), [displayName, formattedReleaseDate, vote_average]);

    if (!poster_path) return null;

    const cardStyles = {
        width: `${CARD_DIMENSIONS.width}px`,
        height: `${CARD_DIMENSIONS.height}px`,
        willChange: 'transform'
    };

    return (
        <article
            className={STYLE_CONSTANTS.cardBase}
            style={cardStyles}
            aria-labelledby={`card-title-${id}`}
        >
            <Link
                to={linkTo}
                className={STYLE_CONSTANTS.linkBase}
                style={cardStyles}
                aria-label={mediaDescription}
                role="link"
                tabIndex="0"
            >
                <PosterImage
                    src={`${posterImageBaseURL}${posterImageBaseURL.endsWith('/') ? '' : '/'}${poster_path?.startsWith('/') ? poster_path.slice(1) : poster_path}`}
                    alt={displayName ? `Poster for ${displayName}` : "Movie poster"}
                />

                <div className='absolute top-4' aria-hidden={!trending}>
                    {(trending && index >= 0) && <TrendingBadge index={index} />}
                </div>

                <div className={STYLE_CONSTANTS.infoOverlay} role="contentinfo">
                    <h2 id={`card-title-${id}`} className='line-clamp-1 text-ellipsis text-lg font-semibold'>
                        {displayName}
                    </h2>
                    <div className='flex justify-between text-sm'>
                        <div>
                            {releaseDate && (
                                <ReleaseDate
                                    date={releaseDate}
                                    formattedDate={formattedReleaseDate}
                                />
                            )}
                        </div>
                        {(Number(vote_average) > 0) && <Rating value={vote_average} />}
                    </div>
                </div>
            </Link>
        </article>
    );
}, (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id &&
        prevProps.trending === nextProps.trending &&
        prevProps.index === nextProps.index &&
        prevProps.mediaType === nextProps.mediaType &&
        prevProps.posterImageBaseURL === nextProps.posterImageBaseURL;
});

TrendingBadge.displayName = 'TrendingBadge';
Rating.displayName = 'Rating';
ReleaseDate.displayName = 'ReleaseDate';
PosterImage.displayName = 'PosterImage';
Card.displayName = 'Card';

export default Card;