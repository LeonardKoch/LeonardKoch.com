// Run with: bun scripts/generate-rss.ts

import { writeFileSync } from 'fs';
import { posts } from '../src/posts';

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

const items = posts
    .map(
        (post) => `    <item>
      <title>${escapeXml(post.meta.title)}</title>
      <link>${SITE_URL}/post/${post.meta.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/post/${post.meta.slug}</guid>
      <pubDate>${formatRssDate(post.meta.date)}</pubDate>
      <description>${escapeXml(post.meta.description)}</description>
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
    <lastBuildDate>${formatRssDate(posts[0]?.meta.date || new Date().toISOString())}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

writeFileSync('./public/rss.xml', rss);
console.log('Generated public/rss.xml');
