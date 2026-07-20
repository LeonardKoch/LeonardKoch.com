import { toPostMeta, slugFromPath, type PostMeta } from '../lib/post-schema';

export type { PostMeta };

export interface Post {
    meta: PostMeta;
    Component: React.ComponentType;
}

// Auto-discover every post in content/posts. Add a post = add an .mdx file.
// `eager` inlines the modules so their components are available during SSR.
const modules = import.meta.glob<{
    default: React.ComponentType;
    frontmatter: Record<string, unknown>;
}>('../../content/posts/*.mdx', { eager: true });

// Array of all posts, sorted by date (newest first)
export const posts: Post[] = Object.entries(modules)
    .map(([path, mod]) => ({
        meta: toPostMeta(slugFromPath(path), mod.frontmatter),
        Component: mod.default,
    }))
    .sort(
        (a, b) =>
            new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
    );

// Helper to find a post by slug
export function getPostBySlug(slug: string): Post | undefined {
    return posts.find((p) => p.meta.slug === slug);
}
