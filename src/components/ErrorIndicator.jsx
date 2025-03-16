import React from 'react';

const ErrorIndicator = React.memo(({ message, onRetry, error }) => (
  <div
    role="alert"
    aria-live="assertive"
    className="container mx-auto flex flex-col items-center justify-center p-8 text-center"
  >
    <div
      className="mb-4 animate-pulse text-red-500"
      aria-hidden="true"
    >
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
    <h3
      className="mb-3 text-xl font-bold text-gray-200"
      id="error-heading"
    >
      Oops! Something went wrong
    </h3>
    <p
      className="mb-4 max-w-md text-gray-400"
      aria-labelledby="error-heading"
    >
      {message || 'An error occurred while loading the content.'}
    </p>
    {error && (
      <p
        className="mb-4 max-w-md rounded bg-red-900/20 p-2 font-mono text-sm text-red-400"
        role="alert"
      >
        {error.toString()}
      </p>
    )}
    {onRetry && (
      <button
        onClick={onRetry}
        className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Try loading the content again"
      >
        Try Again
      </button>
    )}
  </div>
));

export default ErrorIndicator;