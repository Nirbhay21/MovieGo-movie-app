import React, { useCallback, memo } from 'react'
import { mobileNavigation } from '../config/navigation'
import { NavLink } from 'react-router-dom'

const STYLE_CONSTANTS = {
    nav: 'fixed bottom-0 left-0 right-0 h-14 bg-black/80 px-2 backdrop-blur-2xl lg:hidden',
    container: 'flex h-full items-center justify-between text-neutral-400',
    icon: 'text-2xl',
    label: 'text-sm',
    baseLink: 'flex flex-col items-center px-3 py-1 rounded transition-colors',
    focusState: 'focus:outline-none',
};

const NavItem = memo(({ href, icon, label }) => {
    const getLinkClasses = useCallback(({ isActive }) => `${STYLE_CONSTANTS.baseLink}
        ${isActive ? "text-white" : "hover:text-white focus:text-white"}
        ${STYLE_CONSTANTS.focusState}`, []);

    return (
        <NavLink
            to={href}
            className={getLinkClasses}
            aria-label={`${label} page`}
            role="menuitem"
            aria-current={({ isActive }) => isActive ? "page" : undefined}
            aria-selected={({ isActive }) => isActive}
        >
            <span className={STYLE_CONSTANTS.icon} aria-hidden="true" role="presentation">{icon}</span>
            <span className={STYLE_CONSTANTS.label} role="menuitem">{label}</span>
        </NavLink>
    );
});

NavItem.displayName = 'NavItem';

const MobileNavigation = memo(() => {
    const navItems = React.useMemo(() =>
        mobileNavigation.map((nav) => (
            <NavItem
                key={nav.label + "MobileNavigation"}
                href={nav.href}
                icon={nav.icon}
                label={nav.label}
            />
        ))
    , []);

    return (
        <nav
            className={STYLE_CONSTANTS.nav}
            role="navigation"
            aria-label="Mobile Navigation">
            <div
                className={STYLE_CONSTANTS.container}
                role="menubar"
                aria-orientation="horizontal"
            >
                {navItems}
            </div>
        </nav>
    )
});

MobileNavigation.displayName = 'MobileNavigation';

export default MobileNavigation;