import React from 'react';

const DIVIDER_STYLES = {
    base: 'my-2 rounded-full bg-neutral-700',
    thickness: 'p-[0.03125rem]'
};

const Divider = React.memo(({ 
    className = '', label, orientation ='horizontal',
    ...props 
}) => (
    <hr
        role="separator"
        aria-orientation={orientation}
        aria-label={label || 'Content divider'}
        className={`${DIVIDER_STYLES.base} ${DIVIDER_STYLES.thickness} ${className}`.trim()}
        {...props}
    />
));

Divider.displayName = 'Divider';

export default Divider;