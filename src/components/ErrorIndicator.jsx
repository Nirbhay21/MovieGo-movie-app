import React, { memo } from 'react';

const STYLES = {
    container: 'fixed inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/50 backdrop-blur-sm z-50',
    iconWrapper: 'mb-4 animate-pulse text-red-500',
    heading: 'mb-3 text-xl font-bold text-gray-200',
    message: 'mb-4 max-w-md text-gray-400',
    errorDetails: 'mb-4 max-w-md rounded bg-red-900/20 p-2 font-mono text-sm text-red-400',
    button: 'rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
};

const ErrorIcon = memo(() => (
    <div className={STYLES.iconWrapper} aria-hidden="true">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
        </svg>
    </div>
));

const RetryButton = memo(({ onClick }) => (
    <button
        onClick={onClick}
        className={STYLES.button}
        type="button"
        aria-label="Try loading the content again"
    >
        Try Again
    </button>
));

const ErrorDetails = memo(({ error }) => {
    if (!error) return null;
    
    const errorId = `error-details-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
        <details
            className={STYLES.errorDetails}
            role="alert"
            aria-expanded="false"
        >
            <summary
                id={errorId}
                className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={error.ariaLabel}
            >
                View Error Details
            </summary>
            <div aria-labelledby={errorId} className="space-y-2 text-left">
                {error?.status && <p>Status: {error.status}</p>}
                <p>Message: {error?.data?.message || 'Unknown error occurred'}</p>
                {error.timestamp && <p>Time: {new Date(error.timestamp).toLocaleString()}</p>}
                {error?.endpoint && <p>Endpoint: {error.endpoint}</p>}
            </div>
        </details>
    );
});

const ErrorIndicator = memo(({ 
    title = 'Oops! Something went wrong',
    message = 'An error occurred while loading the content.',
    onRetry,
    error 
}) => (
    <div
        role="alert"
        aria-live="assertive"
        className={STYLES.container}
    >
        <ErrorIcon />
        
        <h3
            className={STYLES.heading}
            id="error-heading"
        >
            {title}
        </h3>
        
        <p
            className={STYLES.message}
            aria-labelledby="error-heading"
        >
            {message}
        </p>
        
        <ErrorDetails error={error} />
        
        {onRetry && <RetryButton onClick={onRetry} />}
    </div>
));

ErrorIcon.displayName = 'ErrorIcon';
RetryButton.displayName = 'RetryButton';
ErrorDetails.displayName = 'ErrorDetails';
ErrorIndicator.displayName = 'ErrorIndicator';

export default ErrorIndicator;