import { Link } from '@tanstack/react-router';
import type { ComponentProps } from 'react';

/**
 * The `a` renderer for every MDX post, so plain markdown links
 * (`[text](/post/some-slug)`) behave correctly:
 *
 * - site-relative hrefs become client-side router navigations
 * - everything else (http(s), mailto, #anchors) stays a plain anchor,
 *   with external links opening in a new tab
 */
export function MdxLink({ href = '', children, ...props }: ComponentProps<'a'>) {
    const isInternal = href.startsWith('/') && !href.startsWith('//');

    if (isInternal) {
        return (
            <Link to={href} {...props}>
                {children}
            </Link>
        );
    }

    const isExternal = /^[a-z][a-z0-9+.-]*:/i.test(href);

    return (
        <a
            href={href}
            {...(isExternal
                ? { target: '_blank', rel: 'noreferrer noopener' }
                : {})}
            {...props}
        >
            {children}
        </a>
    );
}
