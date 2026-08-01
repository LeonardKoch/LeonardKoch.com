/*
 * Generates the site's icon set: the initials "LK" in the same layered style as
 * the site's titles (see src/components/SiteTitle.tsx and TitleStack.tsx) —
 * solid dark letters with three outlined blue echoes stepping out behind them.
 *
 * The glyphs are baked into <path> data because a favicon never gets to load a
 * webfont; the outlines come straight out of Inter Bold, the face the header
 * uses. Run with `bun run favicon` after changing any of the constants below.
 */
import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as opentype from 'opentype.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONT_PATH = resolve(ROOT, 'scripts/assets/Inter-Bold.woff');
const PUBLIC_DIR = resolve(ROOT, 'public');

// Google Fonts serves plain WOFF (which opentype.js can parse) to user agents
// that predate WOFF2. Cached in scripts/assets so regeneration works offline.
const FONT_URL =
    'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZs.woff';
const FONT_UA =
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/537.36';

export interface FaviconOptions {
    text: string;
    /** Solid letters, and the swap-in colour for a dark browser chrome. */
    foreground: string;
    foregroundDarkUi: string;
    /** Outline colour of the echoes — the header title's blue. */
    echo: string;
    /*
     * Echo layers, furthest first. Everything is in em, so the mark scales with
     * the box.
     *
     * The cascade runs up and to the left on the 45° diagonal the post titles
     * use, not the header's shallow up-and-right drift. Two letters are a wide,
     * short shape; a horizontal trail stretches it wider still and the square
     * icon then has to shrink everything to fit. Stepping diagonally grows the
     * drawing in both axes at once, which squares it up and buys the letters
     * noticeably more height.
     *
     * Strokes run heavier than the titles' 0.5/0.75/1px-at-24px, for the
     * opposite reason: at favicon sizes a true hairline disappears into the
     * antialiasing.
     */
    stepX: number;
    stepY: number;
    strokes: [number, number, number];
    /** Breathing room around the mark, as a fraction of the icon box. */
    padding: number;
    /**
     * Whether to inline the prefers-color-scheme rule that lightens the letters
     * for a dark browser chrome. Only the SVG wants it: a rasterised PNG is
     * baked at one colour scheme anyway, and resvg ignores media queries.
     */
    adaptive: boolean;
}

export const DEFAULTS: FaviconOptions = {
    text: 'LK',
    foreground: '#1a1a1a', // --text-dark
    foregroundDarkUi: '#f8f9fb', // --blog-bg, so the mark survives a dark tab strip
    echo: '#4d94dd', // BlogHeader's titleColor
    stepX: -0.13,
    stepY: -0.13,
    strokes: [1 / 40, 1 / 30, 1 / 22],
    padding: 0.03,
    adaptive: true,
};

const BLOG_BG = '#f8f9fb'; // --blog-bg

/*
 * Everything the manifest and iOS reference. The SVG stays transparent and
 * adapts to a dark tab strip; the PNGs can't, so anything that gets composited
 * onto an unknown background sits on the site's own paper colour instead.
 *
 * A maskable icon may be cropped to any shape, so its mark is pulled well
 * inside the 80%-diameter safe zone — hence the much larger padding.
 */
const OUTPUTS = [
    { file: 'icon-192.png', size: 192, background: null, padding: 0.03 },
    { file: 'icon-512.png', size: 512, background: null, padding: 0.03 },
    {
        file: 'icon-maskable-512.png',
        size: 512,
        background: BLOG_BG,
        padding: 0.16,
    },
    {
        file: 'apple-touch-icon.png',
        size: 180,
        background: BLOG_BG,
        padding: 0.09,
    },
] as const;

// Everything is emitted on a 1em = 1000 unit grid to keep the path data terse.
const SCALE = 1000;

interface Box {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

async function loadFont(): Promise<opentype.Font> {
    let data: Buffer;
    try {
        data = readFileSync(FONT_PATH);
    } catch {
        console.log(`Fetching ${FONT_URL}`);
        const res = await fetch(FONT_URL, {
            headers: { 'User-Agent': FONT_UA },
        });
        if (!res.ok) throw new Error(`Font download failed: ${res.status}`);
        data = Buffer.from(await res.arrayBuffer());
        mkdirSync(dirname(FONT_PATH), { recursive: true });
        writeFileSync(FONT_PATH, data);
    }
    return opentype.parse(
        data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength),
    );
}

/*
 * Lays the string out by hand rather than via font.getPath: opentype.js chokes
 * on Inter's ccmp lookups, and all we need is advance widths plus kerning.
 * Returns a path in em units with the baseline at y = 0 and y growing downward.
 */
function layOutText(font: opentype.Font, text: string): opentype.Path {
    const glyphs = [...text].map((char) => font.charToGlyph(char));
    const path = new opentype.Path();
    let pen = 0;

    glyphs.forEach((glyph, i) => {
        path.extend(glyph.getPath(pen, 0, 1));
        pen += glyph.advanceWidth! / font.unitsPerEm;
        const next = glyphs[i + 1];
        if (next) pen += font.getKerningValue(glyph, next) / font.unitsPerEm;
    });

    return path;
}

// Multiplies every coordinate of every command: em units -> output grid.
function scalePath(path: opentype.Path, factor: number): opentype.Path {
    const scaled = new opentype.Path();
    scaled.commands = path.commands.map((cmd) =>
        Object.fromEntries(
            Object.entries(cmd).map(([key, value]) => [
                key,
                typeof value === 'number' ? value * factor : value,
            ]),
        ),
    ) as opentype.Path['commands'];
    return scaled;
}

function offsetBox(box: Box, dx: number, dy: number, grow: number): Box {
    return {
        x1: box.x1 + dx - grow,
        y1: box.y1 + dy - grow,
        x2: box.x2 + dx + grow,
        y2: box.y2 + dy + grow,
    };
}

function unionBoxes(boxes: Box[]): Box {
    return boxes.reduce((a, b) => ({
        x1: Math.min(a.x1, b.x1),
        y1: Math.min(a.y1, b.y1),
        x2: Math.max(a.x2, b.x2),
        y2: Math.max(a.y2, b.y2),
    }));
}

const round = (n: number) => Number(n.toFixed(2));

export async function buildFavicon(
    overrides: Partial<FaviconOptions> = {},
): Promise<string> {
    const opts = { ...DEFAULTS, ...overrides };
    const font = await loadFont();
    const glyphPath = layOutText(font, opts.text);
    const glyphBox = glyphPath.getBoundingBox();

    // Furthest layer first: biggest offset, thinnest outline.
    const layers = opts.strokes.map((stroke, i) => {
        const step = opts.strokes.length - i;
        return { dx: opts.stepX * step, dy: opts.stepY * step, stroke };
    });

    /*
     * The icon is centred on the geometric centre of all four layers together,
     * not on the solid letters alone. Round joins and caps mean a stroked layer
     * reaches exactly half its stroke width past the outline, so the union of
     * the inflated boxes is the true extent of the drawing.
     */
    const extent = unionBoxes([
        glyphBox,
        ...layers.map((l) => offsetBox(glyphBox, l.dx, l.dy, l.stroke / 2)),
    ]);

    const width = extent.x2 - extent.x1;
    const height = extent.y2 - extent.y1;
    const side = Math.max(width, height) / (1 - 2 * opts.padding);
    // Shift the drawing so the centre of `extent` lands at the centre of the box.
    const tx = side / 2 - (extent.x1 + extent.x2) / 2;
    const ty = side / 2 - (extent.y1 + extent.y2) / 2;

    const viewBox = round(side * SCALE);
    const pathData = scalePath(glyphPath, SCALE).toPathData(1);

    /*
     * Custom properties are what let the browser restyle the mark on a colour
     * scheme change, but resvg resolves neither them nor the media query — it
     * would rasterise black letters and no echoes at all. Static output gets
     * the literal colours instead.
     */
    const fg = opts.adaptive ? 'var(--fg)' : opts.foreground;
    const echo = opts.adaptive ? 'var(--echo)' : opts.echo;
    const style = opts.adaptive
        ? `\n<style>
:root { --fg: ${opts.foreground}; --echo: ${opts.echo}; }
@media (prefers-color-scheme: dark) { :root { --fg: ${opts.foregroundDarkUi}; } }
</style>`
        : '';

    const marks = [
        ...layers.map(
            (l) =>
                `<use href="#mark" x="${round(l.dx * SCALE)}" y="${round(l.dy * SCALE)}"` +
                ` fill="none" stroke="${echo}" stroke-width="${round(l.stroke * SCALE)}"/>`,
        ),
        `<use href="#mark" fill="${fg}"/>`,
    ];

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBox} ${viewBox}" role="img" aria-label="${opts.text}">${style}
<defs><path id="mark" d="${pathData}"/></defs>
<g transform="translate(${round(tx * SCALE)} ${round(ty * SCALE)})" stroke-linejoin="round" stroke-linecap="round">
${marks.map((m) => `  ${m}`).join('\n')}
</g>
</svg>
`;
}

if (import.meta.main) {
    const svg = await buildFavicon();
    writeFileSync(resolve(PUBLIC_DIR, 'favicon.svg'), svg);
    console.log(`favicon.svg (${svg.length} bytes)`);

    for (const out of OUTPUTS) {
        const source = await buildFavicon({
            padding: out.padding,
            adaptive: false,
        });
        const png = new Resvg(source, {
            fitTo: { mode: 'width', value: out.size },
            ...(out.background ? { background: out.background } : {}),
        })
            .render()
            .asPng();
        writeFileSync(resolve(PUBLIC_DIR, out.file), png);
        console.log(`${out.file} (${out.size}px, ${png.length} bytes)`);
    }
}
