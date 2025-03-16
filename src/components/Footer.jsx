import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaFilm } from 'react-icons/fa';

const ExternalLink = memo(({ href, icon: Icon, label }) => {
    if (!Icon) return null;
    
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-full p-2 text-neutral-400 transition-all hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label={label}
        >
            <Icon className="h-5 w-5 transform transition-transform group-hover:scale-110" aria-hidden="true" />
            <span className="sr-only">{label}</span>
        </a>
    );
});

const FooterLink = memo(({ to, children }) => (
    <Link 
        to={to}
        className="rounded px-3 py-1.5 text-sm text-neutral-400 transition-all hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 md:text-base"
        aria-label={children}
    >
        {children}
    </Link>
));

const Footer = memo(() => (
    <footer className='to-neutral-800/85 relative mt-12 bg-gradient-to-t from-neutral-950/50 pb-6 pt-12 text-center text-neutral-400 backdrop-blur-sm' role="contentinfo">
        <div className="absolute inset-x-0 -top-6">
            <div className="mx-auto h-12 w-12 rounded-xl bg-neutral-950/75 p-2.5 backdrop-blur-sm">
                <FaFilm className="h-full w-full text-white/80" />
            </div>
        </div>
        
        <div className="container mx-auto px-4">
            <div className="mb-6 grid gap-6 md:grid-cols-3 md:gap-4 lg:mb-8 lg:gap-8">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Company</h3>
                    <nav className="flex flex-col items-center space-y-0 lg:space-y-2" aria-label="Company">
                        <FooterLink to="/">About Us</FooterLink>
                        <FooterLink to="/">Careers</FooterLink>
                        <FooterLink to="/">Press</FooterLink>
                    </nav>
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Support</h3>
                    <nav className="flex flex-col items-center space-y-0 lg:space-y-2" aria-label="Support">
                        <FooterLink to="/">Help Center</FooterLink>
                        <FooterLink to="/">Contact Us</FooterLink>
                        <FooterLink to="/">Feedback</FooterLink>
                    </nav>
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Legal</h3>
                    <nav className="flex flex-col items-center space-y-0 lg:space-y-2" aria-label="Legal">
                        <FooterLink to="/">Privacy Policy</FooterLink>
                        <FooterLink to="/">Terms of Service</FooterLink>
                        <FooterLink to="/">Cookie Policy</FooterLink>
                    </nav>
                </div>
            </div>
            
            <div className="flex flex-col items-center space-y-3 border-t border-white/10 pt-6 md:flex-row md:justify-between md:space-y-0 lg:space-y-0">
                <div className="flex space-x-4" aria-label="Social Media Links">
                    <ExternalLink 
                        href="/" 
                        icon={FaGithub} 
                        label="Visit our GitHub"
                    />
                    <ExternalLink 
                        href="/" 
                        icon={FaLinkedin} 
                        label="Visit our LinkedIn"
                    />
                    <ExternalLink 
                        href="/" 
                        icon={FaTwitter} 
                        label="Follow us on Twitter"
                    />
                </div>

                <small className="text-sm opacity-75">
                    &copy; {new Date().getFullYear()} MovieGo. All rights reserved.
                </small>
            </div>
        </div>
    </footer>
));

FooterLink.displayName = 'FooterLink';
ExternalLink.displayName = 'ExternalLink';
Footer.displayName = 'Footer';

export default Footer;