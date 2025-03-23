import React, { useMemo, Suspense, useEffect, useState, useCallback } from 'react'
import { useGetNowPlayingQuery, useGetOnAirTvShowsQuery, useGetPopularTvShowsQuery, useGetTopRatedQuery, useGetTrendingQuery, useGetUpcomingMediaQuery } from '../redux/apiSlice';
import { selectQueryResults } from '../config/utilityFunctions';
import HorizontalScrollCardSkeleton from '../skeletons/HorizontalScrollCardSkeleton';
import BannerHomeSkeleton from '../skeletons/HomeBannerSkeleton';
import PageLoader from '../components/PageLoader';

// Optimized lazy loading with preload hints
const BannerHome = React.lazy(() => import(/* webpackPrefetch: true */ '../components/BannerHome'));
const ErrorIndicator = React.lazy(() => import(/* webpackPrefetch: true */ '../components/ErrorIndicator'));
const HorizontalScrollCard = React.lazy(() => import(/* webpackPrefetch: true */ '../components/HorizontalScrollCard'));

const HomePage = () => {
  // State to control staggered loading
  const [shouldLoadSecondary, setShouldLoadSecondary] = useState(false);
  const [shouldLoadOptional, setShouldLoadOptional] = useState(false);

  // Enable staggered loading
  useEffect(() => {
    // Load secondary content immediately after first paint
    const secondaryTimer = setTimeout(() => {
      setShouldLoadSecondary(true);
    }, 500);

    // Load optional content when user is likely to see it
    const optionalTimer = setTimeout(() => {
      setShouldLoadOptional(true);
    }, 1000);

    return () => {
      clearTimeout(secondaryTimer);
      clearTimeout(optionalTimer);
    };
  }, []);
  const memoizedSelectQueryResults = useMemo(selectQueryResults, []);

  const [retryCount, setRetryCount] = useState(0);

  const {
    trendingData, isTrendingDataLoading,
    isTrendingDataSuccess, isTrendingDataError, trendingDataError,
    refetch: refetchTrending
  } = useGetTrendingQuery(undefined, {
    ...memoizedSelectQueryResults("trendingData"),
    retryOn: (err) => err.status !== 404, // Retry on network errors
    maxRetries: 3
  });

  const {
    nowPlayingData, isNowPlayingDataLoading,
    isNowPlayingDataSuccess, isNowPlayingDataError, nowPlayingDataError,
    refetch: refetchNowPlaying
  } = useGetNowPlayingQuery(undefined, {
    ...memoizedSelectQueryResults("nowPlayingData"),
    retryOn: (err) => err.status !== 404,
    maxRetries: 3
  });

  const handleRetry = useCallback(() => {
    setRetryCount(count => count + 1);
    return Promise.all([
      refetchTrending(),
      refetchNowPlaying()
    ]);
  }, [refetchTrending, refetchNowPlaying]);

  // Secondary data - load after initial delay
  const {
    topRatedData, isTopRatedDataLoading,
    isTopRatedDataSuccess, isTopRatedDataError, topRatedDataError
  } = useGetTopRatedQuery(undefined, {
    ...memoizedSelectQueryResults("topRatedData"),
    skip: !shouldLoadSecondary
  });

  const {
    popularTvShowsData, isPopularTvShowsDataLoading,
    isPopularTvShowsDataSuccess, isPopularTvShowsDataError, popularTvShowsDataError
  } = useGetPopularTvShowsQuery(undefined, {
    ...memoizedSelectQueryResults("popularTvShowsData"),
    skip: !shouldLoadSecondary
  });

  const {
    upcomingMediaData, isUpcomingMediaDataLoading,
    isUpcomingMediaDataSuccess, isUpcomingMediaDataError, upcomingMediaDataError
  } = useGetUpcomingMediaQuery(undefined, {
    ...memoizedSelectQueryResults("upcomingMediaData"),
    skip: !shouldLoadSecondary
  });

  // Optional data - load last
  const {
    onAirTvShowsData, isOnAirTvShowsDataLoading,
    isOnAirTvShowsDataSuccess, isOnAirTvShowsDataError, onAirTvShowsDataError
  } = useGetOnAirTvShowsQuery(undefined, {
    ...memoizedSelectQueryResults("onAirTvShowsData"),
    skip: !shouldLoadOptional
  });

  // Organize components by loading priority
  const priorityGroups = useMemo(() => ({
    critical: [
      {
        data: trendingData,
        loading: isTrendingDataLoading,
        success: isTrendingDataSuccess,
        error: isTrendingDataError,
        errorData: trendingDataError,
        heading: "Trending",
        mediaType: undefined,
        trending: true,
        key: 0
      },
      {
        data: nowPlayingData,
        loading: isNowPlayingDataLoading,
        success: isNowPlayingDataSuccess,
        error: isNowPlayingDataError,
        errorData: nowPlayingDataError,
        heading: "Now Playing",
        mediaType: "movie",
        trending: false,
        key: 1
      }
    ],
    secondary: [
      {
        data: topRatedData,
        loading: !shouldLoadSecondary || isTopRatedDataLoading,
        success: isTopRatedDataSuccess,
        error: isTopRatedDataError,
        errorData: topRatedDataError,
        heading: "Top Rated Movies",
        mediaType: "movie",
        trending: false,
        key: 2
      },
      {
        data: popularTvShowsData,
        loading: !shouldLoadSecondary || isPopularTvShowsDataLoading,
        success: isPopularTvShowsDataSuccess,
        error: isPopularTvShowsDataError,
        errorData: popularTvShowsDataError,
        heading: "Popular TV Shows",
        mediaType: "tv",
        trending: false,
        key: 3
      },
      {
        data: upcomingMediaData,
        loading: !shouldLoadSecondary || isUpcomingMediaDataLoading,
        success: isUpcomingMediaDataSuccess,
        error: isUpcomingMediaDataError,
        errorData: upcomingMediaDataError,
        heading: "Upcoming",
        mediaType: "tv",
        trending: false,
        key: 4
      }
    ],
    optional: [
      {
        data: onAirTvShowsData,
        loading: !shouldLoadOptional || isOnAirTvShowsDataLoading,
        success: isOnAirTvShowsDataSuccess,
        error: isOnAirTvShowsDataError,
        errorData: onAirTvShowsDataError,
        heading: "On The Air",
        mediaType: "tv",
        trending: false,
        key: 5
      }
    ]
  }), [
    trendingData, isTrendingDataLoading, isTrendingDataSuccess, isTrendingDataError, trendingDataError,
    nowPlayingData, isNowPlayingDataLoading, isNowPlayingDataSuccess, isNowPlayingDataError, nowPlayingDataError,
    topRatedData, isTopRatedDataLoading, isTopRatedDataSuccess, isTopRatedDataError, topRatedDataError,
    popularTvShowsData, isPopularTvShowsDataLoading, isPopularTvShowsDataSuccess, isPopularTvShowsDataError, popularTvShowsDataError,
    upcomingMediaData, isUpcomingMediaDataLoading, isUpcomingMediaDataSuccess, isUpcomingMediaDataError, upcomingMediaDataError,
    onAirTvShowsData, isOnAirTvShowsDataLoading, isOnAirTvShowsDataSuccess, isOnAirTvShowsDataError, onAirTvShowsDataError,
    shouldLoadSecondary, shouldLoadOptional
  ]);

  // Set up intersection observer for optional content
  const optionalContentRef = React.useRef();
  
  useEffect(() => {
    if (!shouldLoadOptional) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShouldLoadOptional(true);
            observer.disconnect();
          }
        },
        { rootMargin: '200px' } // Load 200px before content enters viewport
      );

      if (optionalContentRef.current) {
        observer.observe(optionalContentRef.current);
      }

      return () => observer.disconnect();
    }
  }, [shouldLoadOptional]);

  // Optimized render component
  const renderComponent = useMemo(() => (
    { data, loading, success, error, errorData, heading, mediaType, trending, key }
  ) => (
    <React.Fragment key={key}>
      {loading ? (
        <HorizontalScrollCardSkeleton trending={trending} />
      ) : error ? (
        <Suspense fallback={<HorizontalScrollCardSkeleton trending={trending} />}>
          <ErrorIndicator
            message={`Failed to load ${heading}`}
            error={errorData}
            onRetry={handleRetry}
          />
        </Suspense>
      ) : success ? (
        <Suspense fallback={<HorizontalScrollCardSkeleton trending={trending} />}>
          <HorizontalScrollCard
            heading={heading}
            cardsData={data}
            trending={trending}
            mediaType={mediaType}
          />
        </Suspense>
      ) : null}
    </React.Fragment>
  ), [handleRetry]);

  // Handle critical errors
  if ((trendingDataError && nowPlayingDataError) && retryCount < 3) {
    return (
      <Suspense fallback={<PageLoader />}>
        <ErrorIndicator
          message="Unable to load content. Please check your connection."
          error={trendingDataError || nowPlayingDataError}
          onRetry={handleRetry}
        />
      </Suspense>
    );
  }

  return (
    <main aria-label="Movie and TV Show Homepage">
      {/* Critical Content */}
      <section aria-label="Featured Content" aria-busy={isTrendingDataLoading}>
        <Suspense fallback={<BannerHomeSkeleton />}>
          {trendingDataError ? (
            <ErrorIndicator
              message="Failed to load featured content"
              error={trendingDataError}
              onRetry={handleRetry}
            />
          ) : (
            <BannerHome />
          )}
        </Suspense>
      </section>

      {/* Priority-based content rendering with error handling */}
      <section aria-label="Trending and Now Playing" aria-busy={priorityGroups.critical.some(item => item.loading)}>
        {priorityGroups.critical.map(({ error, errorData, ...props }) => (
          error ? (
            <ErrorIndicator
              key={props.key}
              message={`Failed to load ${props.heading}`}
              error={errorData}
              onRetry={handleRetry}
            />
          ) : (
            renderComponent({ error, errorData, ...props })
          )
        ))}
      </section>

      <section aria-label="Additional Movies and Shows" aria-busy={!shouldLoadSecondary || priorityGroups.secondary.some(item => item.loading)}>
        {shouldLoadSecondary && (
          priorityGroups.secondary.map(renderComponent)
        )}
      </section>

      <section
        ref={optionalContentRef}
        aria-label="More TV Shows"
        aria-busy={!shouldLoadOptional || priorityGroups.optional.some(item => item.loading)}
      >
        {shouldLoadOptional && (
          priorityGroups.optional.map(renderComponent)
        )}
      </section>
    </main>
  )
}

export default HomePage
