import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaFilm } from 'react-icons/fa';

const FOOTER_SECTIONS = {
    company: {
        title: 'Company',
        links: [
            { to: '/', label: 'About Us' },
            { to: '/', label: 'Careers' },
            { to: '/', label: 'Press' }
        ]
    },
    support: {
        title: 'Support',
        links: [
            { to: '/', label: 'Help Center' },
            { to: '/', label: 'Contact Us' },
            { to: '/', label: 'Feedback' }
        ]
    },
    legal: {
        title: 'Legal',
        links: [
            { to: '/', label: 'Privacy Policy' },
            { to: '/', label: 'Terms of Service' },
            { to: '/', label: 'Cookie Policy' }
        ]
    }
};

const SOCIAL_LINKS = [
    { href: '/', icon: FaGithub, label: 'Visit our GitHub profile', ariaLabel: 'GitHub' },
    { href: '/', icon: FaLinkedin, label: 'Visit our LinkedIn page', ariaLabel: 'LinkedIn' },
    { href: '/', icon: FaTwitter, label: 'Follow us on Twitter', ariaLabel: 'Twitter' }
];

const COMMON_HOVER_STYLES = 'transition-all hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20';

const ExternalLink = memo(({ href, icon: Icon, label, ariaLabel }) => {
    if (!Icon) return null;
    
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group rounded-full p-2 text-neutral-400 ${COMMON_HOVER_STYLES}`}
            aria-label={label}
        >
            <Icon 
                className="h-5 w-5 transform transition-transform group-hover:scale-110" 
                aria-hidden="true"
                title={ariaLabel}
            />
            <span className="sr-only">{label}</span>
        </a>
    );
});

const FooterLink = memo(({ to, children }) => (
    <Link 
        to={to}
        className={`rounded px-3 py-1.5 text-sm text-neutral-400 md:text-base ${COMMON_HOVER_STYLES}`}
        role="menuitem"
    >
        {children}
    </Link>
));

const FooterSection = memo(({ title, links }) => (
    <div className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90" id={`footer-${title.toLowerCase()}`}>{title}</h3>
        <nav 
            className="flex flex-col items-center space-y-0 lg:space-y-2" 
            aria-labelledby={`footer-${title.toLowerCase()}`}
            role="menu"
        >
            {links.map(link => (
                <FooterLink key={link.label} to={link.to}>{link.label}</FooterLink>
            ))}
        </nav>
    </div>
));

const Footer = memo(() => {
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    
    return (
        <footer className='to-neutral-800/85 relative mt-12 bg-gradient-to-t from-neutral-950/50 pb-6 pt-12 text-center text-neutral-400 backdrop-blur-sm' role="contentinfo" aria-label="Website footer">
            <div className="absolute inset-x-0 -top-6">
                <div className="mx-auto h-12 w-12 rounded-xl bg-neutral-950/75 p-2.5 backdrop-blur-sm" aria-hidden="true">
                    <FaFilm className="h-full w-full text-white/80" />
                </div>
            </div>
            
            <div className="container mx-auto px-4">
                <div 
                    className="mb-6 grid gap-6 md:grid-cols-3 md:gap-4 lg:mb-8 lg:gap-8"
                    role="navigation"
                    aria-label="Footer navigation"
                >
                    {Object.entries(FOOTER_SECTIONS).map(([key, section]) => (
                        <FooterSection key={key} title={section.title} links={section.links} />
                    ))}
                </div>
                
                <div className="flex flex-col items-center space-y-3 border-t border-white/10 pt-6 md:flex-row md:justify-between md:space-y-0 lg:space-y-0">
                    <nav 
                        className="flex space-x-4" 
                        aria-label="Social media links"
                        role="navigation"
                    >
                        {SOCIAL_LINKS.map(link => (
                            <ExternalLink 
                                key={link.ariaLabel}
                                href={link.href} 
                                icon={link.icon} 
                                label={link.label}
                                ariaLabel={link.ariaLabel}
                            />
                        ))}
                    </nav>

                    <small className="text-sm opacity-75" role="contentinfo" aria-label="Copyright">
                        &copy; {currentYear} MovieGo. All rights reserved.
                    </small>
                </div>
            </div>
        </footer>
    );
});

FooterLink.displayName = 'FooterLink';
ExternalLink.displayName = 'ExternalLink';
FooterSection.displayName = 'FooterSection';
Footer.displayName = 'Footer';

export default Footer;