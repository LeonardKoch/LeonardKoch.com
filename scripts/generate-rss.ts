// Run with: bun scripts/generate-rss.ts

import { writeFileSync } from 'fs';
import { readPosts } from './read-posts';

const SITE_URL = 'https://leonardkoch.com';
const SITE_TITLE = 'LeonardKoch';
const SITE_DESCRIPTION = 'Personal blog by Leonard Koch';

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

const posts = readPosts()
    .filter((post) => !post.meta.unpublished)
    .map((post) => post.meta);

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
