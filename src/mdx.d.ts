declare module '*.mdx' {
    import type { MDXProps } from 'mdx/types';

    /** Raw frontmatter exported by remark-mdx-frontmatter (validated at load). */
    export const frontmatter: Record<string, unknown>;

    /** The compiled post component. */
    export default function MDXContent(props: MDXProps): JSX.Element;
}
