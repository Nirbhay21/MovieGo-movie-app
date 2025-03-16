import React from 'react'
import Divider from '../components/Divider';
import { useParams } from 'react-router-dom'
import { formatReleaseDate } from '../config/utilityFunctions';
import { BACKDROP, FALLBACK_IMAGE_BASE_URL, POSTER, PROFILE } from '../config/constants';
import { useGetImageBaseURLQuery, useGetMediaCreditsQuery, useGetMediaDetailsQuery, useGetRecommendedMediaQuery, useGetSimilarMediaQuery } from '../redux/apiSlice';
import { Suspense } from 'react';
import HorizontalScrollCardSkeleton from '../skeletons/HorizontalScrollCardSkeleton';
import DetailsPageSkeleton from '../skeletons/DetailsPageSkeleton';

const HorizontalScrollCard = React.lazy(() => import('../components/HorizontalScrollCard'));

const DetailsPage = () => {
  const params = useParams();

  const { imageBaseURLs, isFetching: isImageBaseURLFetching, isSuccess: isImageBaseURLSuccess } = useGetImageBaseURLQuery({ imageFor: [BACKDROP, POSTER, PROFILE] }, {
    selectFromResult: ({ data, ...rest }) => ({
      imageBaseURLs: (data || FALLBACK_IMAGE_BASE_URL),
      ...rest
    })
  });

  const {
    data: mediaDetails,
    isSuccess: isMediaDetailsSuccess,
    isFetching: isMediaDetailsFetching
  } = useGetMediaDetailsQuery({ mediaType: params.explore, mediaId: params.id });

  const {
    data: mediaCredits,
    isSuccess: isMediaCreditsSuccess,
    isFetching: isMediaCreditsFetching
  } = useGetMediaCreditsQuery({ mediaType: params.explore, mediaId: params.id });

  const {
    similarMedia,
    isSimilarMediaSuccess,
  } = useGetSimilarMediaQuery({ mediaType: params.explore, mediaId: params.id }, {
    selectFromResult: (response) => ({
      similarMedia: response?.data?.results,
      isSimilarMediaSuccess: response.isSuccess,
      isSimilarMediaFetching: response.isFetching,
      ...response
    })
  })

  const {
    recommendMedia,
    isRecommendedMediaSuccess,
  } = useGetRecommendedMediaQuery({ mediaType: params.explore, mediaId: params.id }, {
    selectFromResult: (response) => ({
      recommendMedia: response?.data?.results,
      isRecommendedMediaSuccess: response.isSuccess,
      isRecommendedMediaFetching: response.isFetching,
      ...response
    })
  });

  const getMediaDuration = () => {
    const runtime = Number(mediaDetails?.runtime || 0);
    return {
      hours: Math.floor(runtime / 60),
      minutes: runtime % 60
    };
  };
  
  const getEpDuration = () => {
    const episodeDurations = mediaDetails?.episode_run_time || [];
    if (episodeDurations.length === 0) return { hours: 0, minutes: 0 };
    
    const avgDuration = Math.round(
      episodeDurations.reduce((sum, duration) => sum + duration, 0) / episodeDurations.length
    );
    
    return {
      hours: Math.floor(avgDuration / 60),
      minutes: avgDuration % 60
    };
  };

  const director = mediaCredits?.crew?.filter((el) => el.job === "Director")[0]?.name;
  const writer = Array.from(
    new Set(mediaCredits?.crew?.filter((person) => {
      return person.job === "Writer" ||
        person.job === "Screenplay" ||
        person.job === "Story"
    }).map((el) => el.name))).join(", ");

  if (isMediaDetailsFetching || isMediaCreditsFetching || isImageBaseURLFetching) {
    return (
      <DetailsPageSkeleton />
    )
  }

  return (
    <main aria-busy={!(isMediaDetailsSuccess && isMediaCreditsSuccess && isImageBaseURLSuccess)}>
      <div role="status" className="sr-only" aria-live="polite">
        {!(isMediaDetailsSuccess && isMediaCreditsSuccess && isImageBaseURLSuccess) ? 'Loading media details...' : 'Media details loaded'}
      </div>
      {(isMediaDetailsSuccess && isMediaCreditsSuccess && isImageBaseURLSuccess) && (
        <>
          <section aria-label="Media Backdrop" className='relative hidden h-80 w-full lg:block'>
            <div className='h-full w-full'>
              <img
                src={imageBaseURLs[BACKDROP] + mediaDetails?.backdrop_path}
                alt={mediaDetails.title + " backdrop image"}
                loading='lazy'
                decoding='async'
                className='h-full w-full object-cover'
              />
            </div>
            <div className='absolute top-0 h-full w-full bg-gradient-to-t from-neutral-900/90 to-transparent'></div>
          </section>

          <section className='pt-18 container mx-auto flex flex-col gap-5 px-3 lg:flex-row lg:gap-10 lg:py-0'>
            <div className='min-w-60 relative mx-auto w-fit lg:mx-0 lg:-mt-28'>
              <img
                src={imageBaseURLs[POSTER] + mediaDetails?.poster_path}
                alt={`${mediaDetails.title || mediaDetails.name} poster`}
                className='h-96 w-60 object-contain'
                loading='lazy'
                decoding='async'
              />
            </div>

            <div className='w-full py-2'>
              <h1 className='text-2xl font-bold text-white lg:text-3xl'>{mediaDetails.title || mediaDetails.name}</h1>
              {mediaDetails.tagline && (
                <p className='text-neutral-400' aria-label="Tagline">{mediaDetails.tagline}</p>
              )}

              <Divider aria-hidden="true" />

              <div className='my-3 flex items-center gap-3' role="region" aria-labelledby="media-stats">
                <h2 id="media-stats" className="sr-only">Media Statistics</h2>
                <p id="rating-desc" className="sr-only">Out of 10 rating scale</p>
                <p aria-describedby="rating-desc">Rating: {Number(mediaDetails.vote_average).toFixed(1)}+</p>
                <span aria-hidden="true">|</span>
                <p>Total Views: {Number(mediaDetails.vote_count).toLocaleString()}</p>
                {(mediaDetails.runtime) ? (
                  <>
                    <span aria-hidden="true">|</span>
                    <p>Runtime: {getMediaDuration().hours} hours {getMediaDuration().minutes} minutes</p>
                  </>
                ) : (mediaDetails.episode_run_time?.length > 0) && (
                  <>
                    <span aria-hidden="true">|</span>
                    <p>Episode Runtime: {(getEpDuration().hours > 0 ? getEpDuration().hours + " hours" : "")} {getEpDuration().minutes} minutes</p>
                  </>
                )}
              </div>

              <Divider />

              <section aria-labelledby="overview-heading">
                <h2 id="overview-heading" className='mb-1 text-xl font-bold text-white'>Overview</h2>
                <p>{mediaDetails.overview}</p>

                <Divider aria-hidden="true" />

                <div className='my-3 flex items-center gap-3 text-center' role="region" aria-labelledby="release-info">
                  <h3 id="release-info" className="sr-only">Release Information</h3>
                  <p>Production Status: {mediaDetails.status}</p>
                  {(mediaDetails?.release_date || mediaDetails?.first_air_date) && (
                    <>
                      <span aria-hidden="true">|</span>
                      <p>Release Date: {formatReleaseDate(mediaDetails.release_date || mediaDetails?.first_air_date)}</p>
                    </>
                  )}

                  {(mediaDetails?.revenue > 0) && (
                    <>
                      <span aria-hidden="true">|</span>
                      <p>Box Office Revenue: ${Number(mediaDetails?.revenue).toLocaleString()}</p>
                    </>
                  )}
                </div>

                <Divider aria-hidden="true" />
              </section>

              {mediaCredits?.crew.length > 0 && (
                <>
                  <section aria-label="Credits">
                    {console.log(director)}
                    <p><span className='text-white'>Director: </span>{director}</p>
                    <Divider aria-hidden="true" />
                    <p><span className='text-white'>Writer: </span>{writer}</p>
                  </section>
                  <Divider aria-hidden="true" />
                </>
              )}

              <section aria-labelledby="cast-heading">
                <h2 id="cast-heading" className='text-lg font-bold'>Cast</h2>
                <div className='grid grid-cols-[repeat(auto-fit,6rem)] justify-center gap-5' role="grid" aria-label="Cast members grid">
                  {mediaCredits.cast.filter((castMember) => castMember?.profile_path).map((castMember) => (
                    <div key={castMember.id} role="gridcell">
                      <div>
                        <img
                          src={imageBaseURLs[PROFILE] + castMember?.profile_path}
                          alt={`${castMember?.name} - Cast Member`}
                          className='h-24 w-24 rounded-full object-cover'
                          loading='lazy'
                          decoding='async'
                        />
                      </div>
                      <p className='text-center text-sm font-bold' aria-label={`${castMember?.name}, cast member`}>{castMember?.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </>
      )}

      <section aria-label="Related Media">
        {(isSimilarMediaSuccess) && (
          <Suspense fallback={<HorizontalScrollCardSkeleton trending={false} />}>
            <HorizontalScrollCard cardsData={similarMedia} heading={"Similar " + params?.explore} mediaType={params.explore} />
          </Suspense>
        )}
        {(isRecommendedMediaSuccess && Array.isArray(recommendMedia) && recommendMedia.length > 0) && (
          <Suspense fallback={<HorizontalScrollCardSkeleton trending={false} />}>
            <HorizontalScrollCard cardsData={recommendMedia} heading={"Recommended " + params?.explore} mediaType={params.explore} />
          </Suspense>
        )}
      </section>
    </main>
  )
}

export default DetailsPage