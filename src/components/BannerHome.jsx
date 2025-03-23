import { useGetImageBaseURLQuery, useGetTrendingQuery } from '../redux/apiSlice';
import { FALLBACK_IMAGE_BASE_URL } from '../config/constants';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import BannerHomeSkeleton from '../skeletons/HomeBannerSkeleton';
import { Link } from 'react-router-dom';

const BannerSlide = React.memo(({ banner, index, currentBannerIndex, imageBaseURL, showPreviousBanner, showNextBanner }) => {
  // Calculate responsive dimensions
  const [dimensions, setDimensions] = useState(() => ({
    width: window.innerWidth,
    height: window.innerWidth * 720 / 1280
  }));

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerWidth * 720 / 1280
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Optimize transform for better performance
  const transform = `translate3d(${-currentBannerIndex * 100}%, 0, 0)`;

  return (
    <div
      className='group relative min-h-[28rem] min-w-full overflow-hidden transition lg:min-h-full'
      style={{
        transform,
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
      aria-hidden={currentBannerIndex !== index}
    >
      <div className='relative h-[56.25vw] max-h-[96vh] min-h-[28rem] w-full lg:min-h-full' style={{ backgroundColor: '#1a1a1a' }}>
        <img
          src={imageBaseURL + banner.backdrop_path}
          alt={(banner.title || banner.name || "Featured media") + " banner"}
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          decoding={index === 0 ? 'sync' : 'async'}
          className='h-full w-full object-cover'
          width={dimensions.width}
          height={dimensions.height}
          style={{
            contentVisibility: index === 0 ? 'visible' : 'auto',
            aspectRatio: '16/9'
          }}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE_BASE_URL + banner.backdrop_path;
          }}
        />
      </div>

      {/* Carousel Controls */}
      <div className='absolute top-0 hidden h-full w-full items-center justify-between p-2 text-black lg:p-4 lg:text-2xl group-hover:lg:flex'>
        <button
          className='z-10 cursor-pointer rounded-full bg-neutral-300 p-1 hover:bg-white'
          onClick={showPreviousBanner}
          aria-label="Previous banner"
        >
          <FaAngleLeft aria-hidden="true" />
        </button>
        <button
          className='z-10 cursor-pointer rounded-full bg-neutral-300 p-1 hover:bg-white'
          onClick={showNextBanner}
          aria-label="Next banner"
        >
          <FaAngleRight aria-hidden="true" />
        </button>
      </div>

      <div className='absolute top-0 h-full w-full bg-gradient-to-t from-neutral-900 to-transparent'></div>

      <div className='container mx-auto'>
        <div className='absolute bottom-0 max-w-md px-3'>
          <h2 className='text-2xl font-bold text-white drop-shadow-2xl lg:text-4xl'>{banner.title || banner.name}</h2>
          <p className='my-2 line-clamp-3 text-ellipsis lg:text-lg'>{banner.overview}</p>
          <div className='flex space-x-4' aria-label="Movie details">
            <p>Rating: {Number(banner.vote_average).toFixed(1)}+</p>
            <span aria-hidden="true">|</span>
            <p>Views: {Number(banner.popularity).toFixed(0)}</p>
          </div>
          <Link to={"/" + banner.media_type + "/" + banner.id} className='from-gradient-primary to-gradient-secondary mt-4 inline-block cursor-pointer rounded-sm bg-white px-7 py-2 font-bold text-black transition-transform hover:scale-105 hover:bg-gradient-to-l' aria-label={`Play ${banner.title || banner.name}`}
          >
            Play Now
          </Link>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.currentBannerIndex === nextProps.currentBannerIndex &&
    prevProps.imageBaseURL === nextProps.imageBaseURL &&
    prevProps.banner.id === nextProps.banner.id;
});

const BannerHome = () => {
  // Optimize image URL fetching
  const { imageBaseURL, isSuccess: isImageBaseURLSuccess } = useGetImageBaseURLQuery(
    { imageFor: "backdrop" },
    {
      selectFromResult: ({ data, ...rest }) => ({
        imageBaseURL: (data || FALLBACK_IMAGE_BASE_URL),
        isSuccess: rest.isSuccess
      })
    }
  );

  // Optimize banner data fetching with minimal fields
  const { bannerData, isSuccess: isBannerDataSuccess } = useGetTrendingQuery(
    undefined,
    {
      selectFromResult: (response) => ({
        bannerData: response?.data?.results?.slice(0, 5)?.map(item => ({
          id: item.id,
          title: item.title || '',
          name: item.name || '',
          backdrop_path: item.backdrop_path,
          overview: item.overview || '',
          vote_average: item.vote_average || 0,
          popularity: item.popularity || 0,
          media_type: item.media_type || 'movie'
        })),
        isSuccess: response.isSuccess
      })
    }
  );

  // Optimize state management
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerLength = useMemo(() => Math.min(bannerData?.length || 0, 5), [bannerData]);

  // Preload next image
  // Initialize passive touch handling
  // Initialize passive touch handling
  useEffect(() => {
    if (!carouselRef.current) return;

    const carousel = carouselRef.current;
    // The touch-action CSS property already handles most touch behavior
    // We only need passive event listeners for any custom handling
    const options = { passive: true };
    
    carousel.addEventListener('touchstart', () => {}, options);
    carousel.addEventListener('touchmove', () => {}, options);

    return () => {
      carousel.removeEventListener('touchstart', () => {}, options);
      carousel.removeEventListener('touchmove', () => {}, options);
    };
  }, []);

  // Preload next image
  useEffect(() => {
    if (bannerData && imageBaseURL) {
      const nextIndex = (currentBannerIndex + 1) % bannerLength;
      const nextImage = new Image();
      nextImage.src = imageBaseURL + bannerData[nextIndex]?.backdrop_path;
    }
  }, [currentBannerIndex, bannerData, imageBaseURL, bannerLength]);

  const showPreviousBanner = useCallback(() => {
    setCurrentBannerIndex(prevIndex => (
      (prevIndex > 0) ? prevIndex - 1 : bannerLength - 1
    ));
  }, [bannerLength]);

  const showNextBanner = useCallback(() => {
    setCurrentBannerIndex(prevIndex => (
      (prevIndex < bannerLength - 1) ? prevIndex + 1 : 0
    ));
  }, [bannerLength]);

  // Track visibility state
  const [isVisible, setIsVisible] = useState(true);
  const carouselRef = useRef(null);

  // Handle auto-rotation and visibility
  useEffect(() => {
    if (bannerLength <= 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, { threshold: 0.3 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    let intervalId;
    if (isVisible) {
      intervalId = setInterval(showNextBanner, 7000);
    }

    return () => {
      observer.disconnect();
      if (intervalId) clearInterval(intervalId);
    };
  }, [bannerLength, showNextBanner, isVisible]);

  // Optimized banner list with visibility tracking
  const memoizedBannerList = useMemo(() => (
    bannerData?.map((banner, index) => (
      <BannerSlide
        key={banner.id + "bannerHome" + index}
        banner={banner}
        index={index}
        currentBannerIndex={currentBannerIndex}
        imageBaseURL={imageBaseURL}
        showPreviousBanner={showPreviousBanner}
        showNextBanner={showNextBanner}
      />
    ))
  ), [bannerData, currentBannerIndex, imageBaseURL, showPreviousBanner, showNextBanner]);

  useEffect(() => {
    if (bannerData?.[0] && imageBaseURL) {
      const img = new Image();
      img.src = imageBaseURL + bannerData[0].backdrop_path;
      img.fetchPriority = 'high';
    }
  }, [bannerData, imageBaseURL]);

  if (!isBannerDataSuccess || !isImageBaseURLSuccess) {
    return (
      <div aria-live="polite">
        <BannerHomeSkeleton />
      </div>
    );
  }

  return (
    <section
      className='h-full w-full'
      role="region"
      aria-label="Featured Shows Banner"
    >
      <div
        ref={carouselRef}
        className='flex max-h-[96vh] min-h-full overflow-hidden'
        aria-live="polite"
        style={{
          willChange: isVisible ? 'transform' : 'auto',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          opacity: isVisible ? 1 : 0.8,
          transition: 'opacity 0.3s ease-out',
          touchAction: 'pan-y pinch-zoom'
        }}
      >
        {memoizedBannerList}
      </div>
    </section>
  );
};

export default React.memo(BannerHome);