import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import HomePage from "../pages/HomePage";
import App from "../App";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingBoundary from "../components/LoadingBoundary";
import { ROUTES } from "./constants";

// Lazy load non-critical routes
const ExplorePage = lazy(() => import("../pages/ExplorePage"));
const DetailsPage = lazy(() => import("../pages/DetailsPage"));
const SearchPage = lazy(() => import("../pages/SearchPage"));

// Wraps Suspense with improved loading boundary
const withLoadingBoundary = (Component) => (
    <LoadingBoundary>
        <Suspense fallback={null}>
            {Component}
        </Suspense>
    </LoadingBoundary>
);

const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: <App />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: ROUTES.EXPLORE,
                element: withLoadingBoundary(<ExplorePage />),
                errorElement: <ErrorBoundary />,
            },
            {
                path: ROUTES.DETAILS,
                element: withLoadingBoundary(<DetailsPage />),
                errorElement: <ErrorBoundary />,
            },
            {
                path: ROUTES.SEARCH,
                element: withLoadingBoundary(<SearchPage />),
                errorElement: <ErrorBoundary />,
            }
        ]
    }
], {
    future: {
        v7_normalizeFormMethod: true,
        v7_relativeSplatPath: true
    },
    // Enable built-in scroll restoration
    scrollBehavior: "auto",
    // Prevent scroll position from being automatically reset on navigation
    preventScrollReset: false
});

export default router;