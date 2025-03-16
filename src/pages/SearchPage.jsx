import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetImageBaseURLQuery, useSearchMediaQuery } from '../redux/apiSlice';
import Card from '../components/Card';
import MediaCardSkeleton from '../skeletons/MediaCardSkeleton';
import ErrorIndicator from '../components/ErrorIndicator';
import { FALLBACK_IMAGE_BASE_URL, POSTER } from '../config/constants';
import { getSkeletonCardsCount } from '../config/utilityFunctions';

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const formattedSearchQuery = new URLSearchParams(location.search).get("q") || "";

    const [pageNo, setPageNo] = useState(1);
    const [searchQuery, setSearchQuery] = useState(formattedSearchQuery);
    const [skeletonCardsCount, setSkeletonCardsCount] = useState(18);
    const isFetching = useRef(false);

    const { searchedResults, totalPageNo, isSuccess: isSearchResultsSuccess, isFetching: isSearchResultsFetching } = useSearchMediaQuery({ query: searchQuery, pageNo: pageNo }, {
        selectFromResult: (response) => ({
            searchedResults: response?.data?.results,
            totalPageNo: response?.data?.total_pages,
            ...response
        }),
    });

    console.log(searchQuery);

    console.log(searchedResults);

    const { imageBaseURL } = useGetImageBaseURLQuery({ imageFor: POSTER }, {
        selectFromResult: ({ data, ...rest }) => ({
            imageBaseURL: (data ?? FALLBACK_IMAGE_BASE_URL),
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
        setSearchQuery(formattedSearchQuery);
    }, [formattedSearchQuery]);

    useEffect(() => {
        navigate(`/search?q=${searchQuery.trim()}`);
    }, [searchQuery, navigate]);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    }

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
            <div className='top-18 container sticky z-10 mx-auto my-2 px-2 lg:hidden'>
                <input type="text" placeholder='Search here' onChange={handleSearch} value={searchQuery} className='w-full rounded-full bg-white px-4 py-1 text-lg text-neutral-900' autoFocus />
            </div>
            <div className='container mx-auto'>
                <h2 className='mx-3 my-3 text-lg font-semibold capitalize lg:mx-1 lg:text-2xl'>Search Results</h2>

                <div className='grid grid-cols-[repeat(auto-fit,14.5rem)] justify-center gap-6 lg:justify-start'>
                    {(isSearchResultsSuccess) ? searchedResults.map((item, index) => (
                        ((item?.poster_path) && (
                            <Card data={item} trending={false} posterImageBaseURL={imageBaseURL} key={item.id + "search" + index} mediaType={item.media_type} />
                        ))
                    )) : (
                        <ErrorIndicator />
                    )}

                    {(isSearchResultsFetching) && Array.from({ length: skeletonCardsCount }).map((_, index) => (
                        <div aria-hidden="true" key={index + "explorePage"}>
                            <MediaCardSkeleton />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SearchPage