import type { Plugin } from 'vite';

// Matches the declaration remark-mdx-frontmatter emits (configured with
// `name: 'frontmatter'` in vite.config.ts). Anchored to a line start because
// that is where it always lands, and so a stray occurrence inside a post body
// can't be rewritten by accident.
const DECLARATION = /^export const frontmatter = /m;

// Same length as the text it replaces, so every column on that line — and so
// the sourcemap MDX already produced — stays valid.
const LET_DECLARATION = 'export let   frontmatter = ';

/**
 * Keeps editing a post's body a real Fast Refresh update instead of a route
 * remount.
 *
 * A compiled post exports two things: `MDXContent` and `frontmatter`.
 * React Refresh only treats a module as a refresh boundary when every export
 * is either a component or reference-equal to the previous run, and a fresh
 * object literal is neither — so each edit made the post call
 * `import.meta.hot.invalidate()`. That invalidation walked up through
 * `virtual:posts` and src/posts/index.ts (neither accepts HMR) to
 * src/routes/post/$slug.tsx, whose route was then rebuilt with a new lazy
 * component. React saw a new element type, unmounted the page, and suspended
 * on the re-imported chunk — long enough for the document to collapse to
 * header height and the browser to clamp the scroll position to the top.
 *
 * Reusing the previous object whenever the frontmatter is unchanged satisfies
 * the reference-equality check, so body edits now hot-update in place with the
 * scroll position untouched. Editing the frontmatter itself still produces a
 * new object, which invalidates as before — that path has to propagate,
 * because the post list holds the old values.
 *
 * `export let` is what makes the swap possible: const bindings can't be
 * reassigned, and live bindings mean importers observe the reused object.
 */
export function mdxHmr(): Plugin {
    let isServe = false;

    return {
        name: 'mdx-hmr',
        // The MDX plugin is also `pre`; listing this one after it in the
        // plugin array is what puts this transform downstream of the compiler.
        enforce: 'pre',

        config(_config, { command }) {
            isServe = command === 'serve';
        },

        transform(code, id) {
            if (!isServe) return;
            if (!id.split('?', 1)[0].endsWith('.mdx')) return;
            if (!DECLARATION.test(code)) return;

            const stabilized =
                code.replace(DECLARATION, LET_DECLARATION) +
                `
if (import.meta.hot) {
    const prev = import.meta.hot.data.frontmatter;
    if (prev && JSON.stringify(prev) === JSON.stringify(frontmatter)) {
        frontmatter = prev;
    }
    import.meta.hot.data.frontmatter = frontmatter;
}
`;

            // Nothing moved: the declaration keeps its length and the rest is
            // appended, so the incoming sourcemap still describes the output.
            return { code: stabilized, map: { mappings: '' } };
        },
    };
}
