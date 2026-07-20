import { z } from 'zod';

// Frontmatter authored at the top of each content/posts/*.mdx file.
// `slug` is NOT part of frontmatter — it is derived from the filename.
export const frontmatterSchema = z.object({
    title: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
    color: z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'color must be a hex value'),
    description: z.string().min(1),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export interface PostMeta extends Frontmatter {
    slug: string;
}

/**
 * Validate raw frontmatter and combine it with a slug into a PostMeta.
 * Throws a readable error naming the offending file when validation fails.
 * Used by both the Vite glob loader and the standalone RSS script.
 */
export function toPostMeta(slug: string, raw: unknown): PostMeta {
    const result = frontmatterSchema.safeParse(raw);
    if (!result.success) {
        throw new Error(
            `Invalid frontmatter in post "${slug}":\n${z.prettifyError(result.error)}`,
        );
    }
    return { slug, ...result.data };
}

/** Derive a post slug from an .mdx file path (basename without extension). */
export function slugFromPath(filePath: string): string {
    return filePath.replace(/^.*\//, '').replace(/\.mdx$/, '');
}
