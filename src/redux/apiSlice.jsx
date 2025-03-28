import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKDROP, FALLBACK_BACKDROP_IMAGE_SIZE, FALLBACK_IMAGE_BASE_URL, FALLBACK_POSTER_IMAGE_SIZE, FALLBACK_PROFILE_IMAGE_SIZE, POSTER, PROFILE } from "../config/constants";

// Using the redirect path instead of direct function path
const API_BASE_URL = '/api/tmdb';

// Optimized cache durations based on data type
const CACHE_DURATIONS = {
    configuration: 86400,  // Configuration - 24 hours
    trending: 300,        // Trending data - 5 minutes
    nowPlaying: 900,      // Now playing - 15 minutes
    details: 3600,        // Media details - 1 hour
    search: 60,          // Search results - 1 minute
    default: 120         // Default - 2 minutes
};

// Enhanced error handler with detailed logging
const handleApiError = (error) => {
    let message = 'Unknown error occurred';
    let retryable = true;

    console.error('[API Error Details]:', {
        status: error?.status,
        statusText: error?.statusText,
        data: error?.data,
        error: error?.error,
        headers: error?.headers,
        url: error?.url,
        type: error?.type,
        originalError: error
    });

    if (error?.status === 401) {
        message = 'Authentication failed. Please check your API access token.';
        retryable = false;
    } else if (error?.status === 403) {
        message = 'Access denied. Please check your API permissions.';
        retryable = false;
    } else if (error?.status === 429) {
        message = 'Too many requests. Please try again in a moment.';
        retryable = true;
    } else if (!navigator.onLine) {
        message = 'No internet connection.';
        retryable = true;
    }

    return { message, retryable, details: error };
};

// Simplified base query configuration
const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    headers: {
        'Accept': 'application/json'
    }
});

// Enhanced query with proper error handling
const enhancedBaseQuery = async (args, api, extraOptions) => {
    try {
        const result = await baseQuery(args, api, extraOptions);
        
        if (result.error) {
            return { 
                error: handleApiError(result.error)
            };
        }
        
        return result;
    } catch (error) {
        return {
            error: handleApiError(error)
        };
    }
};

// Rest of your code remains the same...
const addAccessibilityMetadata = (data, type = '') => {
    if (!data) return data;

    if (Array.isArray(data.results)) {
        data.results = data.results.map(item => ({
            ...item,
            ariaLabel: `${item.title || item.name || 'Untitled'}, ${type} ${item.release_date ? `released ${item.release_date}` : ''}`,
            role: 'article'
        }));
        
        data.ariaLabel = `${type} collection with ${data.results.length} items`;
        data.role = 'feed';
    } else {
        data.ariaLabel = `${data.title || data.name || 'Untitled'} ${data.release_date ? `released ${data.release_date}` : ''}`;
        data.role = 'article';
    }

    return data;
};

export const api = createApi({
    reducerPath: "tmdbApi",
    baseQuery: enhancedBaseQuery,
    keepUnusedDataFor: CACHE_DURATIONS.default,
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
        getImageBaseURL: builder.query({
            query: () => "/configuration",
            keepUnusedDataFor: CACHE_DURATIONS.configuration,
            providesTags: ["Configuration"],
            transformResponse: (response, meta, arg) => {
                const baseURL = response?.images?.secure_base_url || FALLBACK_IMAGE_BASE_URL;

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
                };

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
                    });
                    return imageTypesResult;
                }
                return baseURL;
            }
        }),

        getTrending: builder.query({
            query: () => "/trending/all/week",
            keepUnusedDataFor: CACHE_DURATIONS.trending,
            providesTags: ['TrendingMedia'],
            transformResponse: (response) => addAccessibilityMetadata(response, 'trending')
        }),

        getNowPlaying: builder.query({
            query: () => "/movie/now_playing",
            keepUnusedDataFor: CACHE_DURATIONS.nowPlaying,
            providesTags: ['NowPlayingMedia'],
            transformResponse: (response) => addAccessibilityMetadata(response, 'now playing')
        }),

        getTopRated: builder.query({
            query: () => "/movie/top_rated",
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: ['TopRatedMedia'],
            transformResponse: (response) => addAccessibilityMetadata(response, 'top rated')
        }),

        getPopularTvShows: builder.query({
            query: () => "/tv/popular",
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: ['PopularTvShows'],
            transformResponse: (response) => addAccessibilityMetadata(response, 'popular TV shows')
        }),

        getUpcomingMedia: builder.query({
            query: () => "/movie/upcoming",
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: ['UpcomingMedia'],
            transformResponse: (response) => addAccessibilityMetadata(response, 'upcoming')
        }),

        getOnAirTvShows: builder.query({
            query: () => ({
                url: '/tv/on_the_air',
                params: {
                    language: 'en-US'
                }
            }),
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: ['OnAirTvShows'],
            transformResponse: (response) => addAccessibilityMetadata(response, 'TV shows on air')
        }),

        getDiscoverMedia: builder.query({
            query: ({ mediaType, pageNo }) => ({
                url: `/discover/${mediaType}`,
                params: { page: pageNo }
            }),
            keepUnusedDataFor: CACHE_DURATIONS.default,
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${queryArgs.mediaType}`;
            },
            merge: (currentCache, newItems) => {
                if (!currentCache.results) {
                    currentCache.results = [];
                }
                const existingIds = new Set(currentCache.results.map(item => item.id));
                const uniqueNewItems = newItems.results.filter(item => !existingIds.has(item.id));
                currentCache.results.push(...uniqueNewItems);

                addAccessibilityMetadata(currentCache, 'discovered media');
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg?.pageNo !== previousArg?.pageNo;
            },
            providesTags: (result, error, { mediaType, pageNo }) => (
                (result) ? [{ type: "DiscoverMedia", id: `${mediaType}-page-${pageNo}` }] : []
            ),
            transformResponse: (response, meta, arg) => 
                addAccessibilityMetadata(response, `discovered ${arg.mediaType}`)
        }),

        searchMedia: builder.query({
            query: ({ query, pageNo }) => ({
                url: "/search/multi",
                params: { query, page: pageNo }
            }),
            keepUnusedDataFor: CACHE_DURATIONS.search,
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${queryArgs.query}`;
            },
            merge: (currentCache, newItems) => {
                if (!currentCache.results) {
                    currentCache.results = [];
                }
                const existingIds = new Set(currentCache.results.map(item => item.id));
                const uniqueNewItems = newItems.results.filter(item => !existingIds.has(item.id));
                currentCache.results.push(...uniqueNewItems);

                addAccessibilityMetadata(currentCache, 'search results');
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg?.query && (
                    currentArg?.pageNo !== previousArg?.pageNo || currentArg?.query !== previousArg?.query
                );
            },
            providesTags: (result, error, { query, pageNo }) => (
                (result) ? [{ type: "SearchMedia", id: `${query}-page-${pageNo}` }] : []
            ),
            transformResponse: (response) => addAccessibilityMetadata(response, 'search results')
        }),

        getMediaDetails: builder.query({
            query: ({ mediaType, mediaId }) => ({
                url: `/${mediaType}/${mediaId}`
            }),
            keepUnusedDataFor: CACHE_DURATIONS.details,
            providesTags: (result, error, { mediaType, mediaId }) => [
                { type: mediaType === 'movie' ? 'MediaDetailsMovie' : 'MediaDetailsTv', id: mediaId }
            ],
            transformResponse: (response, meta, arg) => 
                addAccessibilityMetadata(response, arg.mediaType)
        }),

        getMediaCredits: builder.query({
            query: ({ mediaType, mediaId }) => ({
                url: `/${mediaType}/${mediaId}/credits`
            }),
            keepUnusedDataFor: CACHE_DURATIONS.details,
            providesTags: (result, error, { mediaType, mediaId }) => [
                { type: mediaType === 'movie' ? 'MediaCreditsMovie' : 'MediaCreditsTv', id: mediaId }
            ],
            transformResponse: (response) => {
                if (response.cast) {
                    response.cast = response.cast.map(person => ({
                        ...person,
                        ariaLabel: `${person.name} as ${person.character || 'Unknown character'}`,
                        role: 'listitem'
                    }));
                }
                if (response.crew) {
                    response.crew = response.crew.map(person => ({
                        ...person,
                        ariaLabel: `${person.name}, ${person.job || 'crew member'}`,
                        role: 'listitem'
                    }));
                }
                return {
                    ...response,
                    ariaLabel: `Cast and crew information`,
                    role: 'list'
                };
            }
        }),

        getSimilarMedia: builder.query({
            query: ({ mediaType, mediaId }) => ({
                url: `/${mediaType}/${mediaId}/similar`
            }),
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: (result, error, { mediaType, mediaId }) => [
                { type: mediaType === 'movie' ? 'SimilarMediaMovie' : 'SimilarMediaTv', id: mediaId }
            ],
            transformResponse: (response) => addAccessibilityMetadata(response, 'similar items')
        }),

        getRecommendedMedia: builder.query({
            query: ({ mediaType, mediaId }) => ({
                url: `/${mediaType}/${mediaId}/recommendations`
            }),
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: (result, error, { mediaType, mediaId }) => [
                { type: mediaType === 'movie' ? 'RecommendedMediaMovie' : 'RecommendedMediaTv', id: mediaId }
            ],
            transformResponse: (response) => addAccessibilityMetadata(response, 'recommendations')
        }),

        getMediaVideos: builder.query({
            query: ({ mediaId, mediaType }) => `/${mediaType}/${mediaId}/videos`,
            keepUnusedDataFor: CACHE_DURATIONS.default,
            providesTags: (result, error, { mediaType, mediaId }) => [
                { type: mediaType === 'movie' ? 'MovieVideos' : 'TvVideos', id: mediaId }
            ],
            transformResponse: (response) => {
                if (response.results) {
                    response.results = response.results.map(video => ({
                        ...video,
                        ariaLabel: `${video.type}: ${video.name}`,
                        role: 'listitem'
                    }));
                }
                return {
                    ...response,
                    ariaLabel: 'Available videos',
                    role: 'list'
                };
            }
        })
    })
});

export const {
    useGetImageBaseURLQuery,
    useGetTrendingQuery,
    useGetNowPlayingQuery,
    useGetTopRatedQuery,
    useGetPopularTvShowsQuery,
    useGetUpcomingMediaQuery,
    useGetOnAirTvShowsQuery,
    useGetDiscoverMediaQuery,
    useSearchMediaQuery,
    useGetMediaDetailsQuery,
    useGetMediaCreditsQuery,
    useGetSimilarMediaQuery,
    useGetRecommendedMediaQuery,
    useGetMediaVideosQuery
} = api;
