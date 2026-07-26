import { Link } from '@tanstack/react-router';
import { TitleStack } from './TitleStack';
import { MDXComponentsProvider } from './mdx';
import type { PostMeta } from '../posts';

interface PostLayoutProps {
    meta: PostMeta;
    children: React.ReactNode;
    isFullPage?: boolean;
}

function formatDate(dateString: string): string {
    // Frontmatter dates are calendar dates, not instants. `new Date('2026-07-26')`
    // parses as UTC midnight, which formats as the previous day in any timezone
    // behind UTC — so build the date from its parts and keep it local throughout.
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function PostLayout({
    meta,
    children,
    isFullPage = false,
}: PostLayoutProps) {
    return (
        <article className="w-full max-w-[1024px] mx-auto py-12 relative">
            {/* Header dot pattern - stronger intensity */}
            <div className="absolute -left-8 -right-8 md:-left-16 md:-right-16 top-0 h-[220px]">
                <div
                    className="absolute inset-0 dot-paper dot-paper-header"
                    style={{ '--dot-color': meta.color } as React.CSSProperties}
                />
            </div>

            {/* Content dot pattern - faint with cutout around text */}
            <div className="absolute -left-8 -right-8 md:-left-16 md:-right-16 top-[180px] bottom-0">
                <div
                    className="absolute inset-0 dot-paper dot-paper-content"
                    style={
                        {
                            '--dot-color': meta.color,
                            backgroundPosition: '0 -180px',
                        } as React.CSSProperties
                    }
                />
            </div>

            {/* Footer dot pattern - thinner band closing out the post */}
            <div className="absolute -left-8 -right-8 md:-left-16 md:-right-16 bottom-0 h-[90px]">
                <div
                    className="absolute inset-0 dot-paper dot-paper-footer"
                    style={{ '--dot-color': meta.color } as React.CSSProperties}
                />
            </div>

            {/* Title Area */}
            <header className="relative z-10 pt-16 pb-12 px-4 md:px-8">
                {isFullPage ? (
                    <div>
                        <TitleStack title={meta.title} color={meta.color} />
                    </div>
                ) : (
                    <Link
                        to="/post/$slug"
                        params={{ slug: meta.slug }}
                        className="block hover:opacity-80 transition-opacity"
                    >
                        <TitleStack title={meta.title} color={meta.color} />
                    </Link>
                )}
                <time className="block mt-4 ml-[30px] text-gray-500 font-light text-sm">
                    {formatDate(meta.date)}
                </time>
            </header>

            {/* Content Area */}
            <div className="relative z-10 px-4 md:px-8 pb-8">
                <div className="prose-blog ml-[30px]">
                    <MDXComponentsProvider>{children}</MDXComponentsProvider>
                </div>
            </div>
        </article>
    );
}
