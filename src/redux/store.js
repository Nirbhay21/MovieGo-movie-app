import { configureStore } from "@reduxjs/toolkit";
import { api } from "./apiSlice";

/**
 * Configure Redux store with performance optimizations.
 * Development mode includes additional checks and DevTools.
 * @type {import("@reduxjs/toolkit").EnhancedStore}
 */
const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        const middleware = getDefaultMiddleware({
            // Optimizations for development environment
            immutableCheck: import.meta.env.DEV,
            serializableCheck: import.meta.env.DEV,
        });
        return middleware.concat(api.middleware);
    },
    devTools: import.meta.env.DEV, // Enable DevTools only in development
});

export default store;