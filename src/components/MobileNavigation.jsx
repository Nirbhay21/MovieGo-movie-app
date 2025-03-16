import React from 'react'
import { mobileNavigation } from '../config/navigation'
import { NavLink } from 'react-router-dom'

const MobileNavigation = React.memo(() => {
    return (
        <nav className='fixed bottom-0 left-0 right-0 h-14 bg-black/70 px-2 backdrop-blur-2xl lg:hidden' aria-label="Mobile Navigation">
            <div className='flex h-full items-center justify-between text-neutral-400'>
                {mobileNavigation.map((nav) => (
                    <NavLink
                        key={nav.label + "MobileNavigation"}
                        to={nav.href}
                        className={({ isActive }) => `flex flex-col items-center px-3 ${isActive ? "text-white" : ""}`}
                    >
                        <span className='text-2xl' aria-hidden="true">{nav.icon}</span>
                        <span className='text-sm'>{nav.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    )
});

export default MobileNavigation