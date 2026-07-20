import { MDXProvider } from '@mdx-js/react';
import type { ReactNode } from 'react';
import { FullBleed } from './FullBleed';
import { Hero } from './Hero';
import { Split } from './Split';

// The catalog of components available in every .mdx post without an import.
// Authors can still `import` one-off components at the top of a post for
// arbitrary/interactive widgets.
export const mdxComponents = {
    FullBleed,
    Hero,
    Split,
};

/**
 * Provides the shared MDX component catalog to any compiled post rendered
 * inside it. Works on the server (SSR) and the client.
 */
export function MDXComponentsProvider({ children }: { children: ReactNode }) {
    return <MDXProvider components={mdxComponents}>{children}</MDXProvider>;
}

export { FullBleed, Hero, Split };
