import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetImageBaseURLQuery, useSearchMediaQuery } from '../redux/apiSlice';
import Card from '../components/Card';
import MediaCardSkeleton from '../skeletons/MediaCardSkeleton';
import ErrorIndicator from '../components/ErrorIndicator';
import { FALLBACK_IMAGE_BASE_URL, POSTER } from '../config/constants';
import { getSkeletonCardsCount } from '../config/utilityFunctions';
import { BiMoviePlay } from "react-icons/bi";
import { FiTv } from "react-icons/fi";
import { BiCameraMovie } from "react-icons/bi";

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const formattedSearchQuery = new URLSearchParams(location.search).get("q") || "";

    const [pageNo, setPageNo] = useState(1);
    const [searchQuery, setSearchQuery] = useState(formattedSearchQuery);
    const [skeletonCardsCount, setSkeletonCardsCount] = useState(18);
    const debounceTimerRef = useRef(null);
    const isFetching = useRef(false);

    const {
        searchedResults,
        totalPageNo,
        error,
        isError: isSearchResultsError,
        isSuccess: isSearchResultsSuccess,
        isFetching: isSearchResultsFetching
    } = useSearchMediaQuery({ query: formattedSearchQuery, pageNo: pageNo }, {
        selectFromResult: (response) => ({
            searchedResults: response?.data?.results,
            totalPageNo: response?.data?.total_pages,
            error: response.error,
            ...response
        }),
        skip: !formattedSearchQuery.trim()
    });

    const { imageBaseURL } = useGetImageBaseURLQuery({ imageFor: POSTER }, {
        selectFromResult: ({ data, ...rest }) => ({
            imageBaseURL: (data ?? FALLBACK_IMAGE_BASE_URL),
            ...rest
        })
    });

    const handleScroll = useCallback(() => {
        if (pageNo >= totalPageNo) return;

        if ((window.innerHeight + window.scrollY + 120) >= document.body.offsetHeight) {
            if (!isFetching.current) {
                isFetching.current = true;
                setPageNo((prevPageNo) => prevPageNo + 1);
            }
        }
    }, [pageNo, totalPageNo]);

    const handleSearch = useCallback((event) => {
        const value = event.target.value;
        setSearchQuery(value);
        
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            navigate(`/search?q=${value.trim()}`);
        }, 300);
    }, [navigate]);

    useEffect(() => {
        setSearchQuery(formattedSearchQuery);
    }, [formattedSearchQuery]);

    // Cleanup debounce timer
    useEffect(() => {
        return () => {
            clearTimeout(debounceTimerRef.current);
        };
    }, []);

    useEffect(() => {
        isFetching.current = false;
    }, [searchedResults]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        const handleResize = () => {
            setSkeletonCardsCount(getSkeletonCardsCount());
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className='py-16'>
            <div className='top-18 container sticky z-10 mx-auto my-2 px-4 sm:px-2 lg:hidden'>
                <input type="text" placeholder='Search here' onChange={handleSearch} value={searchQuery} className='w-full rounded-full bg-white px-4 py-1 text-lg text-neutral-900' autoFocus />
            </div>
            <div className='container mx-auto px-4 sm:px-2'>
                {searchQuery.trim() ? (
                    <>
                        <h2 className='my-3 px-4 text-lg font-semibold capitalize sm:px-0 lg:mx-1 lg:text-2xl'>Search Results</h2>
                        <div className='grid grid-cols-[repeat(auto-fit,14.5rem)] justify-center gap-6 lg:justify-start'>
                            {isSearchResultsError ? (
                                <div className="col-span-full flex min-h-[60vh] items-center justify-center">
                                    <ErrorIndicator error={error} />
                                </div>
                            ) : (
                                <>
                                    {isSearchResultsSuccess && (
                                        searchedResults?.length ? (
                                            searchedResults.map((item, index) => (
                                                ((item?.poster_path) && (
                                                    <Card data={item} trending={false} posterImageBaseURL={imageBaseURL} key={item.id + "search" + index} mediaType={item.media_type} />
                                                ))
                                            ))
                                        ) : (
                                            <div className="col-span-full flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                                                <div className="mb-6 flex animate-pulse items-center gap-3 sm:mb-8 sm:gap-4">
                                                    <BiMoviePlay className="text-4xl text-blue-500 sm:text-6xl" />
                                                    <BiCameraMovie className="text-4xl text-pink-500 sm:text-6xl" />
                                                </div>
                                                <h2 className="mb-3 text-2xl font-bold text-gray-200 sm:mb-4 sm:text-3xl">No Results Found</h2>
                                                <p className="mb-6 max-w-[280px] px-2 text-base text-gray-400 sm:max-w-2xl sm:text-lg">
                                                    We couldn't find any matches for "{searchQuery}". Try checking your spelling or using different keywords.
                                                </p>
                                                <div className="w-[280px] max-w-[300px] sm:w-96 sm:max-w-2xl">
                                                    <div className="rounded-lg border border-gray-700/50 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-4 shadow-lg backdrop-blur-sm sm:p-6">
                                                        <div className="mb-3 flex items-center justify-center space-x-2 text-center sm:mb-4">
                                                            <div className="flex items-center rounded-full bg-blue-500/20 p-1.5 sm:p-2">
                                                                <svg className="h-5 w-5 text-blue-400 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-gray-200 sm:text-xl">Search Tips</h3>
                                                        </div>
                                                        <div className="flex flex-col items-start space-y-3 sm:space-y-4">
                                                            <div className="flex items-center gap-1.5 text-gray-300 sm:gap-2">
                                                                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span>Check for typos</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-300">
                                                                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span>Use fewer keywords</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-300">
                                                                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span>Try more general terms</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                    {(isSearchResultsFetching && pageNo <= totalPageNo) && Array.from({ length: skeletonCardsCount }).map((_, index) => (
                                        <div aria-hidden="true" key={index + "explorePage"}>
                                            <MediaCardSkeleton />
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                        <div className="mb-8 flex items-center gap-4">
                            <BiMoviePlay className="text-5xl text-blue-500" />
                            <FiTv className="text-5xl text-purple-500" />
                            <BiCameraMovie className="text-5xl text-pink-500" />
                        </div>
                        <h1 className="mb-4 text-3xl font-bold text-white">Discover Amazing Content</h1>
                        <p className="mb-8 max-w-2xl text-lg text-gray-300">
                            Search for your favorite movies, TV shows, and more. Try searching for:
                        </p>
                        <div className="grid gap-4 text-gray-300 sm:grid-cols-2">
                            <div className="rounded-lg bg-gray-800 p-4">
                                <p className="font-semibold">Popular Movies</p>
                                <p className="text-sm">e.g., "Inception", "The Dark Knight"</p>
                            </div>
                            <div className="rounded-lg bg-gray-800 p-4">
                                <p className="font-semibold">TV Shows</p>
                                <p className="text-sm">e.g., "Breaking Bad", "Stranger Things"</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchPage