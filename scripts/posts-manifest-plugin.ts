import type { Plugin } from 'vite';
import { readPosts } from './read-posts';

const VIRTUAL_ID = 'virtual:posts';
// Rollup convention: \0 marks the id as owned by a plugin, not the filesystem.
const RESOLVED_ID = '\0virtual:posts';

// Root-relative because a virtual module has no directory to resolve against.
const POSTS_GLOB = '/content/posts/*.mdx';

/**
 * Serves `virtual:posts` — the slug → compiled post module map that
 * src/posts/index.ts builds its list from.
 *
 * Production builds list the posts explicitly and leave out the ones marked
 * `unpublished`, so a draft's body, title and slug never reach the bundle.
 * A plain import.meta.glob cannot do that: it inlines every .mdx file, so
 * drafts would still ship inside the JS even though nothing renders them.
 *
 * Development does use the glob, which is what keeps drafts previewable at
 * /post/<slug> — and it leaves Vite in charge of reloading when a post file
 * is added or removed, which a hand-invalidated virtual module doesn't get
 * right across the client and SSR environments.
 */
export function postsManifest(): Plugin {
    let isBuild = false;

    return {
        name: 'posts-manifest',
        enforce: 'pre',

        config(_config, { command }) {
            isBuild = command === 'build';
        },

        resolveId(id) {
            return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
        },

        load(id) {
            if (id !== RESOLVED_ID) return;
            return isBuild ? publishedManifest() : globManifest();
        },
    };
}

/** Every post on disk, discovered and keyed by slug at runtime. */
function globManifest(): string {
    return `const modules = import.meta.glob(${JSON.stringify(POSTS_GLOB)}, { eager: true });

export const postModules = Object.fromEntries(
    Object.entries(modules).map(([path, mod]) => [
        path.replace(/^.*\\//, '').replace(/\\.mdx$/, ''),
        mod,
    ]),
);
`;
}

/** Published posts only, imported by name so drafts can't be bundled. */
function publishedManifest(): string {
    const posts = readPosts().filter((post) => !post.meta.unpublished);

    const imports = posts
        .map(
            (post, i) =>
                `import * as post${i} from ${JSON.stringify(post.path)};`,
        )
        .join('\n');
    const entries = posts
        .map((post, i) => `    ${JSON.stringify(post.meta.slug)}: post${i},`)
        .join('\n');

    return `${imports}\n\nexport const postModules = {\n${entries}\n};\n`;
}
