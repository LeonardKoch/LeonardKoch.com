import { Link } from '@tanstack/react-router';
import { Linkedin, Rss } from 'lucide-react';

interface SocialLink {
    icon: React.ReactNode;
    href: string;
    label: string;
}

function TwitterIcon({ size = 20 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function BlueskyIcon({ size = 20 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
        </svg>
    );
}

// Configure your social links here
const socialLinks: SocialLink[] = [
    {
        icon: <Linkedin size={20} />,
        href: 'https://linkedin.com/in/leonardkoch',
        label: 'LinkedIn',
    },
    {
        icon: <TwitterIcon size={20} />,
        href: 'https://x.com/leonardkoch',
        label: 'X (Twitter)',
    },
    {
        icon: <BlueskyIcon size={20} />,
        href: 'https://bsky.app/profile/leonardkoch.bsky.social',
        label: 'Bluesky',
    },
    {
        icon: <Rss size={20} />,
        href: '/rss.xml',
        label: 'RSS Feed',
    },
];

export function BlogHeader() {
    return (
        <header className="h-[160px] flex flex-col justify-center items-center px-4">
            {/* Logo and Name */}
            <Link
                to="/"
                className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity"
            >
                {/*<img src="/lion.svg" alt="" className="w-10 h-10" />*/}
                <span className="text-2xl font-semibold text-[#1a1a1a] font-display">
                    LeonardKoch
                </span>
            </Link>

            {/* Social Links - hidden if empty */}
            {socialLinks.length > 0 && (
                <nav className="flex items-center gap-4">
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={link.label}
                        >
                            {link.icon}
                        </a>
                    ))}
                </nav>
            )}
        </header>
    );
}
