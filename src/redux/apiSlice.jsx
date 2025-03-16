import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { BACKDROP, FALLBACK_BACKDROP_IMAGE_SIZE, FALLBACK_IMAGE_BASE_URL, FALLBACK_POSTER_IMAGE_SIZE, FALLBACK_PROFILE_IMAGE_SIZE, POSTER, PROFILE } from "../config/constants";

// Optimized cache durations based on data type
const CACHE_DURATIONS = {
    configuration: 86400,  // Configuration - 24 hours
    trending: 300,        // Trending data - 5 minutes
    nowPlaying: 900,      // Now playing - 15 minutes
    details: 3600,        // Media details - 1 hour
    search: 60,          // Search results - 1 minute
    default: 120         // Default - 2 minutes
};

// Enhanced error handler
const handleApiError = (error) => {
    const errorDetails = {
        status: error?.status,
        message: error?.data?.message || 'Unknown error occurred',
        timestamp: new Date().toISOString(),
        endpoint: error?.endpoint
    };

    // Log error for monitoring
    console.error('[API Error]:', errorDetails);

    return errorDetails;
};

// Optimized base query with timeout
const baseQuery = fetchBaseQuery({
    baseUrl: "https://api.themoviedb.org/3",
    prepareHeaders: (headers) => {
        headers.set("Authorization", `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`);
        headers.set('Accept', 'application/json');
        return headers;
    },
    timeout: 10000, // 10 second timeout
});

// Enhanced query with retry logic and exponential backoff
const enhancedBaseQuery = retry(async (args, api, extraOptions) => {
    try {
        // Optimize query parameters
        if (typeof args === "object") {
            args.params = {
                ...(args.params || {}),
                include_adult: false,
                language: "en-US" // Ensure consistent language
            };
        }

        const result = await baseQuery(args, api, extraOptions);

        if (result.error) {
            return {
                error: handleApiError({
                    ...result.error,
                    endpoint: typeof args === 'string' ? args : args.url
                })
            };
        }

        return result;
    } catch (error) {
        return { error: handleApiError(error) };
    }
}, {
    maxRetries: 3,
    backoff: (attempt) => Math.min(1000 * (2 ** attempt), 30000) // Exponential backoff with 30s max
});

export const api = createApi({
    reducerPath: "api",
    baseQuery: enhancedBaseQuery,
    keepUnusedDataFor: 120,
    tagTypes: [
        "DiscoverMedia",
        "SearchMedia",
        "Configuration",
        "TrendingMedia",
        "NowPlayingMedia",
        "TopRatedMedia",
        "PopularTvShows",
        "UpcomingMedia",
        "OnAirTvShows",
        "MediaDetailsMovie",
        "MediaDetailsTv",
        "MediaCreditsMovie",
        "MediaCreditsTv",
        "SimilarMediaMovie",
        "SimilarMediaTv",
        "RecommendedMediaMovie",
        "RecommendedMediaTv"
    ],

    endpoints: (builder) => ({
        // Configuration endpoint with optimized image URL handling
        getImageBaseURL: builder.query({
            query: () => "/configuration",
            keepUnusedDataFor: CACHE_DURATIONS.configuration,
            providesTags: ["Configuration"],
            transformResponse: (response, meta, arg) => {
                const baseURL = response?.images?.secure_base_url || FALLBACK_IMAGE_BASE_URL;

                // Helper function to get optimal image size
                const getOptimalSize = (sizes, defaultSize, targetIndex = 3) => {
                    if (!sizes?.length) return defaultSize;
                    return sizes[Math.min(sizes.length - 1, targetIndex)] || defaultSize;
                };

                const selectOptimalImageSize = (forType) => {
                    if (forType === POSTER) {
                        const size = getOptimalSize(response?.images?.poster_sizes, FALLBACK_POSTER_IMAGE_SIZE);
                        return `${baseURL}${size}`;
                    } else if (forType === BACKDROP) {
                        const size = getOptimalSize(response?.images?.backdrop_sizes, FALLBACK_BACKDROP_IMAGE_SIZE, 2);
                        return `${baseURL}${size}`;
                    } else if (forType === PROFILE) {
                        const size = getOptimalSize(response?.images?.profile_sizes, FALLBACK_PROFILE_IMAGE_SIZE, 1);
                        return `${baseURL}${size}`;
                    }
                }

                if (typeof arg?.imageFor === "string") {
                    return selectOptimalImageSize(arg.imageFor);
                }
                else if (Array.isArray(arg?.imageFor)) {
                    const imageForTypes = arg.imageFor;
                    const sizes = imageForTypes.map((type) => (
                        selectOptimalImageSize(type)
                    ));

                    const imageTypesResult = {};
                    imageForTypes.forEach((type, index) => {
                        imageTypesResult[type] = sizes[index];
                    })
                    return imageTypesResult;
                }
                return baseURL;
            }
        }),

        // Critical data endpoints - highest priority, immediate load
        getTrending: builder.query({
            query: () => "/trending/all/week",
            keepUnusedDataFor: CACHE_DURATIONS.trending,
            providesTags: ['TrendingMedia']
        }),

        getNowPlaying: builder.query({
            query: () => "/movie/now_playing",
            keepUnusedDataFor: CACHE_DURATIONS.nowPlaying,
            providesTags: ['NowPlayingMedia']
        }),

        // Secondary data endpoints - medium priority, deferred load
        getTopRated: builder.query({
            query: () => "/movie/top_rated",
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: ['TopRatedMedia']
        }),

        getPopularTvShows: builder.query({
            query: () => "/tv/popular",
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: ['PopularTvShows']
        }),

        getUpcomingMedia: builder.query({
            query: () => "/movie/upcoming",
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: ['UpcomingMedia']
        }),

        // Optional data endpoint - lowest priority, load on viewport
        getOnAirTvShows: builder.query({
            query: () => "/tv/on_the_air",
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: ['OnAirTvShows']
        }),

        // Discover endpoint with optimized caching and pagination
        getDiscoverMedia: builder.query({
            query: ({ mediaType, pageNo }) => ({
                url: `/discover/${mediaType}`,
                params: { page: pageNo },
            }),
            keepUnusedDataFor: CACHE_DURATIONS.default,
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${queryArgs.mediaType}`;
            },
            merge: (currentCache, newItems) => {
                if (!currentCache.results) {
                    currentCache.results = [];
                }
                // Deduplicate results based on id
                const existingIds = new Set(currentCache.results.map(item => item.id));
                const uniqueNewItems = newItems.results.filter(item => !existingIds.has(item.id));
                currentCache.results.push(...uniqueNewItems);
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg?.pageNo !== previousArg?.pageNo;
            },
            providesTags: (result, error, { mediaType, pageNo }) => (
                (result) ? [{ type: "DiscoverMedia", id: `${mediaType}-page-${pageNo}` }] : []
            )
        }),

        // Search endpoint with short cache duration for responsiveness
        searchMedia: builder.query({
            query: ({ query, pageNo }) => ({
                url: "/search/multi",
                params: { query, page: pageNo },
            }),
            keepUnusedDataFor: CACHE_DURATIONS.search,
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${queryArgs.query}`;
            },
            merge: (currentCache, newItems) => {
                if (!currentCache.results) {
                    currentCache.results = [];
                }
                // Deduplicate results
                const existingIds = new Set(currentCache.results.map(item => item.id));
                const uniqueNewItems = newItems.results.filter(item => !existingIds.has(item.id));
                currentCache.results.push(...uniqueNewItems);
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg?.query && (
                    currentArg?.pageNo !== previousArg?.pageNo || currentArg?.query !== previousArg?.query
                );
            },
            providesTags: (result, error, { query, pageNo }) => (
                (result) ? [{ type: "SearchMedia", id: `${query}-page-${pageNo}` }] : []
            )
        }),

        // Media details endpoint with longer cache duration
        getMediaDetails: builder.query({
            query: ({ mediaType, mediaId }) => ({
                url: `/${mediaType}/${mediaId}`,
            }),
            keepUnusedDataFor: CACHE_DURATIONS.details,
            providesTags: (result, error, { mediaType, mediaId }) => [
                { type: mediaType === 'movie' ? 'MediaDetailsMovie' : 'MediaDetailsTv', id: mediaId }
            ]
        }),

        // Credits endpoint with medium cache duration
        getMediaCredits: builder.query({
            query: ({ mediaType, mediaId }) => ({
                url: `/${mediaType}/${mediaId}/credits`,
            }),
            keepUnusedDataFor: CACHE_DURATIONS.details,
            providesTags: (result, error, { mediaType, mediaId }) => [
                { type: mediaType === 'movie' ? 'MediaCreditsMovie' : 'MediaCreditsTv', id: mediaId }
            ]
        }),

        // Similar media endpoint with medium cache duration
        getSimilarMedia: builder.query({
            query: ({ mediaType, mediaId }) => ({
                url: `/${mediaType}/${mediaId}/similar`,
            }),
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: (result, error, { mediaType, mediaId }) => [
                { type: mediaType === 'movie' ? 'SimilarMediaMovie' : 'SimilarMediaTv', id: mediaId }
            ]
        }),

        // Recommended media endpoint with medium cache duration
        getRecommendedMedia: builder.query({
            query: ({ mediaType, mediaId }) => ({
                url: `/${mediaType}/${mediaId}/recommendations`,
            }),
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: (result, error, { mediaType, mediaId }) => [
                { type: mediaType === 'movie' ? 'RecommendedMediaMovie' : 'RecommendedMediaTv', id: mediaId }
            ]
        })
    })
})

export const {
    useSearchMediaQuery,
    useGetTrendingQuery,
    useGetTopRatedQuery,
    useGetNowPlayingQuery,
    useGetImageBaseURLQuery,
    useGetOnAirTvShowsQuery,
    useGetMediaDetailsQuery,
    useGetMediaCreditsQuery,
    useGetSimilarMediaQuery,
    useGetDiscoverMediaQuery,
    useGetUpcomingMediaQuery,
    useGetPopularTvShowsQuery,
    useGetRecommendedMediaQuery,
} = api;