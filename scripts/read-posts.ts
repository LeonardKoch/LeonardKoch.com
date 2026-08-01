import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import {
    toPostMeta,
    slugFromPath,
    type PostMeta,
} from '../src/lib/post-schema';

const POSTS_DIR = fileURLToPath(new URL('../content/posts', import.meta.url));

export interface PostFile {
    /** Absolute path to the .mdx file. */
    path: string;
    meta: PostMeta;
}

/**
 * Read every post's frontmatter straight off disk, newest first.
 *
 * Node-only: this runs outside a Vite bundle — in the RSS script and in the
 * Vite config's posts-manifest plugin — so it can't use import.meta.glob. It
 * shares the zod schema (toPostMeta) with the site loader, so validation
 * can't drift.
 */
export function readPosts(): PostFile[] {
    return readdirSync(POSTS_DIR)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
            const path = join(POSTS_DIR, file);
            const source = readFileSync(path, 'utf8');
            const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
            if (!match) {
                throw new Error(`Missing frontmatter in ${file}`);
            }
            return {
                path,
                meta: toPostMeta(slugFromPath(file), parseYaml(match[1])),
            };
        })
        .sort(
            (a, b) =>
                new Date(b.meta.date).getTime() -
                new Date(a.meta.date).getTime(),
        );
}
