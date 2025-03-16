import { useParams } from 'react-router-dom'
import { useGetDiscoverMediaQuery, useGetImageBaseURLQuery } from '../redux/apiSlice';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Card from '../components/Card';
import ErrorIndicator from '../components/ErrorIndicator';
import MediaCardSkeleton from '../skeletons/MediaCardSkeleton';
import { FALLBACK_IMAGE_BASE_URL, POSTER } from '../config/constants';
import { useRef } from 'react';
import { getSkeletonCardsCount } from '../config/utilityFunctions';

const ExplorePage = React.memo(() => {
  const params = useParams();
  const [pageNo, setPageNo] = useState(1);
  const [skeletonCardsCount, setSkeletonCardsCount] = useState(18);
  const isFetching = useRef(false);

  const {
    exploreData,
    totalPageNo,
    isSuccess: isExploreDataSuccess,
    isFetching: isExploreDataFetching,
    isLoading: isExploreDataLoading,
    isError: isExploreDataError,
  } = useGetDiscoverMediaQuery({ mediaType: params.explore, pageNo: pageNo }, {
    selectFromResult: (response) => ({
      exploreData: response?.data?.results || [],
      totalPageNo: response?.data?.total_pages || 1,
      ...response
    }),
    skip: !params.explore,
  });

  const { imageBaseURL } = useGetImageBaseURLQuery({ imageFor: POSTER }, {
    selectFromResult: ({ data, ...rest }) => ({
      imageBaseURL: (data || FALLBACK_IMAGE_BASE_URL),
      ...rest
    })
  });

  const handleScroll = useCallback(() => {
    if (isFetching.current && pageNo >= totalPageNo) return;

    if ((window.innerHeight + window.scrollY + 120) >= document.body.offsetHeight) {
      isFetching.current = true;
      setPageNo((prevPageNo) => prevPageNo + 1);
    }
  }, [pageNo, totalPageNo]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    isFetching.current = false;
  }, [exploreData]);

  const uniqueMediaResults = useMemo(() => {
    const seenMediaIds = new Set();
    return exploreData?.filter((media) => {
      if (!media || !media.id || seenMediaIds.has(media.id)) {
        return false;
      } else {
        seenMediaIds.add(media.id);
        return true;
      }
    }) || [];
  }, [exploreData]);

  useEffect(() => {
    const handleResize = () => {
      setSkeletonCardsCount(getSkeletonCardsCount());
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className='py-16' role="main" aria-labelledby="page-title">
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-2 focus:text-black">
        Skip to main content
      </a>

      <div className='container mx-auto'>
        <h1 id="page-title" className='my-3 text-lg font-semibold capitalize lg:text-2xl'>
          Popular {params.explore} Shows
        </h1>

        {/* Screen reader announcements */}
        <div className="sr-only" role="status" aria-live="polite">
          {isExploreDataLoading && `Loading ${params.explore} shows`}
          {isExploreDataFetching && 'Loading more shows...'}
          {isExploreDataSuccess && `${uniqueMediaResults.length} shows loaded${pageNo >= totalPageNo ? '. End of content reached' : ''}`}
          {isExploreDataError && 'Error loading content. Please try again.'}
        </div>

        <div
          id="main-content"
          className='grid grid-cols-[repeat(auto-fit,14.5rem)] justify-center gap-6'
          role="region"
          aria-label={`${params.explore} shows grid`}
          tabIndex="-1"
        >
          {(isExploreDataSuccess) && uniqueMediaResults.map((exploreData) => (
            <Card
              data={exploreData}
              key={exploreData.id}
              mediaType={params.explore}
              posterImageBaseURL={imageBaseURL}
            />
          ))}

          {(isExploreDataFetching || isExploreDataLoading) && Array.from({ length: skeletonCardsCount }).map((_, index) => (
            <div aria-hidden="true" key={index + "explorePage"}>
              <MediaCardSkeleton />
            </div>
          ))}

          {(isExploreDataError) && <div role="alert"><ErrorIndicator /></div>}
        </div>
      </div>
    </main>
  )
});

export default ExplorePage