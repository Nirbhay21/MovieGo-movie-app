import React from 'react';
import ErrorIndicator from './ErrorIndicator';

const ERROR_MESSAGES = {
    default: {
        title: 'Something went wrong',
        message: 'An unexpected error occurred. Please try again later.'
    }
};

const STYLES = {
    container: 'container mx-auto min-h-screen px-3 py-16'
};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null 
        };
        this.handleRetry = this.handleRetry.bind(this);
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log to error reporting service
        console.error('[ErrorBoundary]:', {
            error: error?.message,
            stack: error?.stack,
            componentStack: errorInfo?.componentStack
        });
    }

    handleRetry() {
        this.setState({ hasError: false, error: null });
    }

    render() {
        const { hasError, error } = this.state;
        const { fallback, children } = this.props;

        if (hasError) {
            // If fallback is provided, use it with the error
            if (fallback) {
                return fallback(error);
            }
            
            // Default error UI
            return (
                <div 
                    className={STYLES.container}
                    role="alert"
                    aria-live="polite"
                >
                    <ErrorIndicator 
                        title={ERROR_MESSAGES.default.title}
                        message={ERROR_MESSAGES.default.message}
                        retry={{
                            label: 'Try again',
                            onClick: this.handleRetry,
                            ariaLabel: 'Attempt to reload the content'
                        }}
                    />
                </div>
            );
        }

        return children;
    }
}

// Add runtime type checking
ErrorBoundary.defaultProps = {
    fallback: null
};

ErrorBoundary.displayName = 'ErrorBoundary';

export default ErrorBoundary;