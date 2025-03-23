import React, { memo } from 'react';
import { ImSpinner2 } from 'react-icons/im';

const STYLES = {
    container: "fixed inset-0 flex items-center justify-center bg-neutral-900/20 backdrop-blur-sm",
    spinner: "animate-spin text-4xl text-white"
};

const PageLoader = memo(() => (
    <div
        className={STYLES.container}
        role="status"
        aria-busy="true"
        aria-live="polite"
    >
        <ImSpinner2 className={STYLES.spinner} aria-hidden="true" />
        <span className="sr-only">Content is loading, please wait...</span>
    </div>
));

PageLoader.displayName = 'PageLoader';

export default PageLoader;