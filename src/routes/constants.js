export const ROUTES = {
    HOME: '/',
    EXPLORE: '/:explore',
    DETAILS: '/:explore/:id',
    SEARCH: '/search'
};

export const ROUTE_NAMES = {
    [ROUTES.HOME]: 'Home',
    [ROUTES.EXPLORE]: 'Explore',
    [ROUTES.DETAILS]: 'Details',
    [ROUTES.SEARCH]: 'Search'
};

export const CHUNK_NAMES = {
    EXPLORE: 'explore',
    DETAILS: 'details',
    SEARCH: 'search'
};

export const SUSPENSE_CONFIG = {
    timeoutMs: 3000,
    busyDelayMs: 500,
    busyMinDurationMs: 400
};