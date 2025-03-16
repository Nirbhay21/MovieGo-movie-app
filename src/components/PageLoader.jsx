import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

const PageLoader = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-900/20 backdrop-blur-sm">
        <ImSpinner2 className="animate-spin text-4xl text-white" />
        <span className="sr-only">Loading...</span>
    </div>
);

export default PageLoader;