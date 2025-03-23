import React, { useEffect, useState, useCallback, memo } from 'react';
import { useNavigation } from 'react-router-dom';
import PageLoader from './PageLoader';
import { SUSPENSE_CONFIG } from '../routes/constants';

const STYLE_CONSTANTS = {
    fallbackWrapper: "relative",
    pageWrapper: "relative min-h-screen"
};

const LoadingWrapper = memo(({ type = 'content', children }) => (
    <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={`${type === 'page' ? 'Page' : 'Content'} is loading`}
        className={type === 'page' ? STYLE_CONSTANTS.pageWrapper : STYLE_CONSTANTS.fallbackWrapper}
        tabIndex="-1"
    >
        <div aria-hidden="true">
            {children}
        </div>
        <span className="sr-only">
            Loading {type === 'page' ? 'new page' : ''} content, please wait...
        </span>
    </div>
));

LoadingWrapper.displayName = 'LoadingWrapper';

const LoadingBoundary = memo(({ children, fallback = null, delay = SUSPENSE_CONFIG.busyDelayMs }) => {
    const navigation = useNavigation();
    const [showLoader, setShowLoader] = useState(false);
    
    const startLoading = useCallback(() => setShowLoader(true), []);
    const stopLoading = useCallback(() => setShowLoader(false), []);
    
    useEffect(() => {
        if (navigation.state === 'loading') {
            const timer = setTimeout(startLoading, delay);
            return () => clearTimeout(timer);
        } else {
            stopLoading();
        }
    }, [navigation.state, delay, startLoading, stopLoading]);

    if (!showLoader) return <>{children}</>;
    
    if (fallback) {
        return <LoadingWrapper>{fallback}</LoadingWrapper>;
    }

    return <LoadingWrapper type="page"><PageLoader /></LoadingWrapper>;
});

LoadingBoundary.displayName = 'LoadingBoundary';

export default LoadingBoundary;