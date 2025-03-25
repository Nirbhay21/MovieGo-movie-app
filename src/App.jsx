import { Outlet, ScrollRestoration } from "react-router-dom"
import { lazy, Suspense, memo } from "react"
import ErrorBoundary from "./components/ErrorBoundary"
import PageLoader from "./components/PageLoader"
import LoadingBoundary from "./components/LoadingBoundary"

// Lazy load layout components
const Header = lazy(() => import('./components/Header'))
const Footer = lazy(() => import('./components/Footer'))
const MobileNavigation = lazy(() => import('./components/MobileNavigation'))

// Memoize static components
const HeaderMemo = memo(Header)
const FooterMemo = memo(Footer)
const MobileNavigationMemo = memo(MobileNavigation)
function App() {
  return (
    <ErrorBoundary>
      <div className="pb-14 sm:px-0 lg:pb-0">
        {/* Skip to main content link */}
        <a href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4 focus:text-black">
          Skip to main content
        </a>

        {/* Header with loading state */}
        <Suspense>
          <LoadingBoundary
            fallback={
              <div className="h-16 animate-pulse bg-gradient-to-r from-gray-100 to-gray-200"
                role="banner"
                aria-label="Loading header" />
            }
          >
            <HeaderMemo />
          </LoadingBoundary>
        </Suspense>

        {/* Main content with error boundary */}
        <main id="main-content"
          className="min-h-screen w-full"
          role="main">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Footer with loading state */}
        <Suspense>
          <LoadingBoundary
            fallback={
              <div className="h-16 animate-pulse bg-gradient-to-r from-gray-100 to-gray-200"
                role="contentinfo"
                aria-label="Loading footer" />
            }
          >
            <FooterMemo />
          </LoadingBoundary>
        </Suspense>

        {/* Mobile navigation with silent loading */}
        <Suspense>
          <LoadingBoundary>
            <nav aria-label="Mobile navigation">
              <MobileNavigationMemo />
            </nav>
          </LoadingBoundary>
        </Suspense>

        {/* Enhanced scroll restoration */}
        <ScrollRestoration
          getKey={(location) => {
            // Keep route-specific scroll position by including the full pathname and search params
            const searchParams = new URLSearchParams(location.search);
            return `${location.pathname}${searchParams.get('q') ? '?q=' + searchParams.get('q') : ''}`;
          }}
        />

        {/* Live region for important announcements */}
        <div aria-live="assertive" aria-atomic="true" className="sr-only">
        </div>
      </div>
    </ErrorBoundary>
  )
}

// Prevent unnecessary re-renders
export default memo(App)