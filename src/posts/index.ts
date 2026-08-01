import { postModules } from 'virtual:posts';
import { toPostMeta, type PostMeta } from '../lib/post-schema';

export type { PostMeta };

export interface Post {
    meta: PostMeta;
    Component: React.ComponentType;
}

// Auto-discover every post in content/posts. Add a post = add an .mdx file.
// The manifest is built by scripts/posts-manifest-plugin.ts, which inlines the
// modules so their components are available during SSR — and drops
// unpublished posts from production builds so they never reach the bundle.
// Development keeps them, so what follows still has to filter.

// Every post the build included, sorted by date (newest first)
const allPosts: Post[] = Object.entries(postModules)
    .map(([slug, mod]) => ({
        meta: toPostMeta(slug, mod.frontmatter),
        Component: mod.default,
    }))
    .sort(
        (a, b) =>
            new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
    );

// Posts safe to list anywhere. Anything marked `unpublished: true` in its
// frontmatter is left out — in development as well as production.
export const posts: Post[] = allPosts.filter((p) => !p.meta.unpublished);

// Helper to find a post by slug. Unpublished posts stay reachable under their
// own slug during development so drafts can be previewed; in production they
// 404 like any unknown slug.
export function getPostBySlug(slug: string): Post | undefined {
    const visible = import.meta.env.DEV ? allPosts : posts;
    return visible.find((p) => p.meta.slug === slug);
}
