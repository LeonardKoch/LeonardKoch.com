import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * A tiny sketch-diagram kit: wobbly, twice-drawn outlines and a small set of
 * wordless icons. The wobble comes from a turbulence + displacement filter
 * applied to the whole drawing.
 *
 * Every filled shape reads its fill from `var(--pass-fill, <own fill>)`. The
 * second (offset) pass sets `--pass-fill: none`, which turns the same tree into
 * a pure outline overdraw — the doubled line is what sells the hand-drawn look.
 */

export const tones = {
    ink: { stroke: '#333a45', fill: '#ffffff' },
    muted: { stroke: '#c2c8d2', fill: '#fbfbfc' },
    red: { stroke: '#c14444', fill: '#fbf0ef' },
    green: { stroke: '#3f8b62', fill: '#edf5f0' },
    paper: { stroke: '#e4e7ec', fill: '#ffffff' },
} as const;

export type Tone = keyof typeof tones;

const DASH = '7 5';
const STROKE_WIDTH = 1.7;
const ICON_WIDTH = 2;

/** Fill that the outline-only second pass can switch off. */
function passFill(fill: string): CSSProperties {
    return { fill: `var(--pass-fill, ${fill})` };
}

interface PanelProps {
    width: number;
    height: number;
    /** Screen-reader description — the drawing itself carries no words. */
    title: string;
    children: ReactNode;
}

export function Panel({ width, height, title, children }: PanelProps) {
    // Filter ids must be unique per instance but stable across SSR/hydration.
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const pass1 = `${uid}p1`;
    const pass2 = `${uid}p2`;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="block w-full h-auto"
            role="img"
            aria-label={title}
        >
            <title>{title}</title>
            <defs>
                <filter
                    id={pass1}
                    x="-3%"
                    y="-3%"
                    width="106%"
                    height="106%"
                    colorInterpolationFilters="sRGB"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.016"
                        numOctaves={2}
                        seed={5}
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale={2.2}
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
                <filter
                    id={pass2}
                    x="-3%"
                    y="-3%"
                    width="106%"
                    height="106%"
                    colorInterpolationFilters="sRGB"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.023"
                        numOctaves={2}
                        seed={23}
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale={3.4}
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </defs>

            <g filter={`url(#${pass1})`}>{children}</g>
            <g
                filter={`url(#${pass2})`}
                opacity={0.45}
                style={{ '--pass-fill': 'none' } as CSSProperties}
            >
                {children}
            </g>
        </svg>
    );
}

/* -------------------------------- shapes -------------------------------- */

interface BoxProps {
    x: number;
    y: number;
    w: number;
    h: number;
    tone?: Tone;
    dashed?: boolean;
    rx?: number;
    fillOpacity?: number;
}

export function Box({
    x,
    y,
    w,
    h,
    tone = 'ink',
    dashed,
    rx = 8,
    fillOpacity,
}: BoxProps) {
    const t = tones[tone];
    return (
        <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx={rx}
            style={passFill(t.fill)}
            fillOpacity={fillOpacity}
            stroke={t.stroke}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={dashed ? DASH : undefined}
        />
    );
}

interface StrokeProps {
    d: string;
    tone?: Tone;
    dashed?: boolean;
    /** Close the path with the tone's fill (used for the torn box). */
    filled?: boolean;
    width?: number;
}

export function Stroke({
    d,
    tone = 'ink',
    dashed,
    filled,
    width = STROKE_WIDTH,
}: StrokeProps) {
    const t = tones[tone];
    return (
        <path
            d={d}
            style={filled ? passFill(t.fill) : { fill: 'none' }}
            stroke={t.stroke}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={dashed ? DASH : undefined}
        />
    );
}

/**
 * An open arrowhead whose tip sits exactly at (x, y). `dir` is the direction of
 * travel, so the wings always fall on the side the wire arrives from.
 */
export function head(
    x: number,
    y: number,
    dir: 'down' | 'right' | 'left',
    s = 6,
) {
    if (dir === 'down')
        return `M${x - s} ${y - s} L${x} ${y} L${x + s} ${y - s}`;
    if (dir === 'right')
        return `M${x - s} ${y - s} L${x} ${y} L${x - s} ${y + s}`;
    return `M${x + s} ${y - s} L${x} ${y} L${x + s} ${y + s}`;
}

/** The wire that leaves a step and simply stops, with a break mark. */
export function BrokenWire({
    x,
    from,
    tone = 'red',
}: {
    x: number;
    from: number;
    tone?: Tone;
}) {
    return (
        <>
            <Stroke d={`M${x} ${from} V${from + 24}`} tone={tone} dashed />
            <Stroke
                d={`M${x - 10} ${from + 42} L${x + 10} ${from + 34} M${x - 10} ${from + 50} L${x + 10} ${from + 42}`}
                tone={tone}
            />
        </>
    );
}

/** Wire junction — a filled dot where one line taps into another. */
export function Junction({
    x,
    y,
    tone = 'ink',
}: {
    x: number;
    y: number;
    tone?: Tone;
}) {
    return <circle cx={x} cy={y} r={3.4} fill={tones[tone].stroke} />;
}

/** Flowchart terminal: a ring, filled once something actually reaches it. */
export function Terminal({
    x,
    y,
    tone = 'ink',
    reached,
}: {
    x: number;
    y: number;
    tone?: Tone;
    reached?: boolean;
}) {
    const t = tones[tone];
    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={18}
                style={passFill(t.fill)}
                stroke={t.stroke}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={reached ? undefined : DASH}
            />
            {reached && (
                <circle cx={x} cy={y} r={6.5} style={passFill(t.stroke)} />
            )}
        </>
    );
}

/** Corner sticker: a circled ✓ or ✗ sitting on a box corner. */
export function Badge({
    x,
    y,
    kind,
}: {
    x: number;
    y: number;
    kind: 'check' | 'cross';
}) {
    const tone: Tone = kind === 'check' ? 'green' : 'red';
    const glyph =
        kind === 'check'
            ? `M${x - 5.5} ${y - 0.5} L${x - 1.5} ${y + 4} L${x + 5.5} ${y - 5}`
            : `M${x - 4.5} ${y - 4.5} L${x + 4.5} ${y + 4.5} M${x + 4.5} ${y - 4.5} L${x - 4.5} ${y + 4.5}`;
    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={13}
                style={passFill('#ffffff')}
                stroke={tones[tone].stroke}
                strokeWidth={STROKE_WIDTH}
            />
            <Stroke d={glyph} tone={tone} width={2.1} />
        </>
    );
}

/* --------------------------------- icons -------------------------------- */

interface IconProps {
    x: number;
    y: number;
    tone?: Tone;
}

/** Four-point spark — the new primitive. */
export function Spark({
    x,
    y,
    tone = 'green',
    r = 14,
}: IconProps & { r?: number }) {
    const i = r * 0.3;
    return (
        <path
            d={`M${x} ${y - r} L${x + i} ${y - i} L${x + r} ${y} L${x + i} ${y + i} L${x} ${y + r} L${x - i} ${y + i} L${x - r} ${y} L${x - i} ${y - i} Z`}
            style={passFill(tones[tone].stroke)}
            stroke={tones[tone].stroke}
            strokeWidth={1}
            strokeLinejoin="round"
        />
    );
}

/** Cog — a step somebody could already write by hand. */
export function Gear({ x, y, tone = 'ink' }: IconProps) {
    const teeth = [0, 45, 90, 135, 180, 225, 270, 315]
        .map((deg) => {
            const a = (deg * Math.PI) / 180;
            const c = Math.cos(a);
            const s = Math.sin(a);
            return `M${(x + c * 11).toFixed(1)} ${(y + s * 11).toFixed(1)} L${(x + c * 15.5).toFixed(1)} ${(y + s * 15.5).toFixed(1)}`;
        })
        .join(' ');
    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={10.5}
                fill="none"
                stroke={tones[tone].stroke}
                strokeWidth={ICON_WIDTH}
            />
            <Stroke d={teeth} tone={tone} width={ICON_WIDTH} />
            <circle
                cx={x}
                cy={y}
                r={3.5}
                fill="none"
                stroke={tones[tone].stroke}
                strokeWidth={ICON_WIDTH}
            />
        </>
    );
}

/** Stack of bars — a pile of material going in. */
export function Stack({ x, y, tone = 'ink' }: IconProps) {
    return (
        <Stroke
            d={`M${x - 16} ${y - 9} H${x + 16} M${x - 13} ${y} H${x + 13} M${x - 9} ${y + 9} H${x + 9}`}
            tone={tone}
            width={ICON_WIDTH + 0.6}
        />
    );
}

/** Bulb — the thing somebody wants to make. */
export function Bulb({ x, y, tone = 'ink' }: IconProps) {
    return (
        <>
            <circle
                cx={x}
                cy={y - 4}
                r={9}
                fill="none"
                stroke={tones[tone].stroke}
                strokeWidth={ICON_WIDTH}
            />
            <Stroke
                d={`M${x - 5} ${y + 7} H${x + 5} M${x - 3.5} ${y + 12} H${x + 3.5}`}
                tone={tone}
                width={ICON_WIDTH}
            />
            <Stroke
                d={`M${x} ${y - 20} V${y - 16} M${x - 13} ${y - 12} L${x - 10} ${y - 9} M${x + 13} ${y - 12} L${x + 10} ${y - 9}`}
                tone={tone}
                width={ICON_WIDTH}
            />
        </>
    );
}

/** Target — the outcome that was being aimed at. */
export function Target({ x, y, tone = 'ink' }: IconProps) {
    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={14}
                fill="none"
                stroke={tones[tone].stroke}
                strokeWidth={ICON_WIDTH}
            />
            <circle
                cx={x}
                cy={y}
                r={7}
                fill="none"
                stroke={tones[tone].stroke}
                strokeWidth={ICON_WIDTH}
            />
            <circle
                cx={x}
                cy={y}
                r={2.6}
                style={passFill(tones[tone].stroke)}
            />
        </>
    );
}

/** App window — something that actually runs. */
export function AppWindow({ x, y, tone = 'ink' }: IconProps) {
    return (
        <>
            <rect
                x={x - 19}
                y={y - 14}
                width={38}
                height={28}
                rx={4}
                fill="none"
                stroke={tones[tone].stroke}
                strokeWidth={ICON_WIDTH}
            />
            <Stroke
                d={`M${x - 19} ${y - 5} H${x + 19}`}
                tone={tone}
                width={ICON_WIDTH}
            />
            {[-13, -8.5, -4].map((dx) => (
                <circle
                    key={dx}
                    cx={x + dx}
                    cy={y - 9.5}
                    r={1.5}
                    style={passFill(tones[tone].stroke)}
                />
            ))}
        </>
    );
}

/** Question mark, drawn rather than typed, so it wobbles like everything else. */
export function Question({ x, y, tone = 'red' }: IconProps) {
    return (
        <>
            <Stroke
                d={`M${x - 8} ${y - 7} A8 8 0 1 1 ${x} ${y + 4} V${y + 9}`}
                tone={tone}
                width={3}
            />
            <circle
                cx={x}
                cy={y + 17}
                r={2.6}
                style={passFill(tones[tone].stroke)}
            />
        </>
    );
}

/* --------------------------------- frame -------------------------------- */

/** The card a diagram is drawn on. */
export function Frame({ width, height }: { width: number; height: number }) {
    return (
        <Box
            x={8}
            y={8}
            w={width - 16}
            h={height - 16}
            rx={16}
            tone="paper"
            fillOpacity={0.62}
        />
    );
}
