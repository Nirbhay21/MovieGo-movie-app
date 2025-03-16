import React from 'react'
import { Link } from 'react-router-dom';
import { formatReleaseDate } from '../config/utilityFunctions';
import { useMemo } from 'react';

const Card = React.memo(({ data, trending, index, mediaType, posterImageBaseURL }) => {

    const { id, poster_path, title, name, release_date, first_air_date, vote_average, media_type: dataMediaType } = data;

    const media_type = dataMediaType || mediaType;
    const displayName = title || name;

    const linkTo = useMemo(() => `/${media_type}/${id}`, [media_type, id]);
    const formattedReleaseDate = useMemo(() => formatReleaseDate(release_date || first_air_date), [release_date, first_air_date]);

    if (!poster_path) return null;

    return (
        <article
            className='relative h-[348px] w-[232px] overflow-hidden rounded'
            style={{ willChange: 'transform' }}
        >
            <Link
                to={linkTo}
                role="article"
                className='block h-[348px] w-[232px] transition hover:scale-105 focus:outline-none focus:ring focus:ring-white focus:ring-offset-1'
                aria-labelledby={`card-title-${id}`}
                tabIndex="0">
                <img
                    src={posterImageBaseURL + poster_path}
                    loading='lazy'
                    decoding='async'
                    width={232}
                    height={348}
                    alt={displayName ? `Poster for ${displayName}` : "Movie poster"}
                    className='h-full w-full object-cover'
                    style={{
                        contentVisibility: 'auto',
                        containIntrinsicSize: '232px 348px'
                    }}
                />
                <div className='absolute top-4' aria-hidden={!trending}>
                    {(trending && index >= 0) && (
                        <div className='overflow-hidden rounded-r-full bg-black/50 px-4 py-1 backdrop-blur-3xl' role="status">
                            #{index} Trending
                        </div>
                    )}
                </div>
                <div className='absolute bottom-0 h-16 w-full bg-black/60 p-2 backdrop-blur-3xl'>
                    <h2 id={`card-title-${id}`} className='line-clamp-1 text-ellipsis text-lg font-semibold'>{displayName}</h2>
                    <div className='flex justify-between text-sm text-neutral-400'>
                        <div>
                            {(release_date || first_air_date) && (
                                <p aria-label={`Release date: ${formattedReleaseDate}`}>{formattedReleaseDate}</p>
                            )}
                        </div>
                        {(Number(vote_average) > 0) && (
                            <p className='rounded-full bg-black px-2 py-0.5 text-xs text-neutral-100' role="note" aria-label={`Rating: ${Number(vote_average).toFixed(1)} out of 10`}>
                                Rating: {Number(vote_average).toFixed(1)}
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    )
}, (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id &&
        prevProps.trending === nextProps.trending &&
        prevProps.index === nextProps.index &&
        prevProps.mediaType === nextProps.mediaType &&
        prevProps.posterImageBaseURL === nextProps.posterImageBaseURL;
});

export default Card