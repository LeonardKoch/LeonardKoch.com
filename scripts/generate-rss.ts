// Run with: bun scripts/generate-rss.ts

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { parse as parseYaml } from 'yaml';
import {
    toPostMeta,
    slugFromPath,
    type PostMeta,
} from '../src/lib/post-schema';

const SITE_URL = 'https://leonardkoch.com';
const SITE_TITLE = 'LeonardKoch';
const SITE_DESCRIPTION = 'Personal blog by Leonard Koch';
const POSTS_DIR = 'content/posts';

// Read post metadata straight from the .mdx frontmatter on disk. This runs
// outside Vite, so it can't use import.meta.glob — but it shares the same zod
// schema (toPostMeta) as the site loader, so validation can't drift.
function loadPosts(): PostMeta[] {
    return readdirSync(POSTS_DIR)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
            const source = readFileSync(join(POSTS_DIR, file), 'utf8');
            const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
            if (!match) {
                throw new Error(`Missing frontmatter in ${file}`);
            }
            return toPostMeta(slugFromPath(file), parseYaml(match[1]));
        })
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function formatRssDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toUTCString();
}

const posts = loadPosts();

const items = posts
    .map(
        (meta) => `    <item>
      <title>${escapeXml(meta.title)}</title>
      <link>${SITE_URL}/post/${meta.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/post/${meta.slug}</guid>
      <pubDate>${formatRssDate(meta.date)}</pubDate>
      <description>${escapeXml(meta.description)}</description>
    </item>`,
    )
    .join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${formatRssDate(posts[0]?.date || new Date().toISOString())}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

writeFileSync('./public/rss.xml', rss);
console.log(`Generated public/rss.xml (${posts.length} posts)`);
