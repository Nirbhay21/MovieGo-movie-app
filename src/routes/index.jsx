import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import HomePage from "../pages/HomePage";
import App from "../App";
import PageLoader from "../components/PageLoader";

// Lazy load non-critical routes
const ExplorePage = lazy(() => import(/* webpackPrefetch: true */ "../pages/ExplorePage"));
const DetailsPage = lazy(() => import(/* webpackPrefetch: true */ "../pages/DetailsPage"));
const SearchPage = lazy(() => import(/* webpackPrefetch: true */ "../pages/SearchPage"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <HomePage />,
            },
            {
                path: ":explore",
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ExplorePage />
                    </Suspense>
                )
            },
            {
                path: ":explore/:id",
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <DetailsPage />
                    </Suspense>
                )
            },
            {
                path: "search",
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <SearchPage />
                    </Suspense>
                )
            }
        ]
    }
]);

export default router;