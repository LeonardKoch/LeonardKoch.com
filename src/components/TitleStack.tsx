interface TitleStackProps {
    title: string;
    colors: string[];
    as?: 'h1' | 'span';
    textClassName?: string;
    scale?: number;
    layerOpacity?: number;
}

// Furthest layer first; offsets are for scale = 1 and shrink with `scale`.
const LAYERS = [
    { x: -12, y: -12, stroke: 0.5, hoverX: 15, hoverY: -8 },
    { x: -9, y: -9, stroke: 0.75, hoverX: -18, hoverY: 5 },
    { x: -6, y: -6, stroke: 1, hoverX: 10, hoverY: 10 },
    { x: -3, y: -3, stroke: 1.5, hoverX: -8, hoverY: -15 },
];

export function TitleStack({
    title,
    colors,
    as: Tag = 'h1',
    textClassName = 'text-4xl md:text-5xl lg:text-6xl',
    scale = 1,
    layerOpacity = 1,
}: TitleStackProps) {
    const layerClass = `absolute font-display font-bold whitespace-nowrap pointer-events-none select-none transition-transform duration-300 ease-out translate-x-[var(--tx)] translate-y-[var(--ty)] group-hover:translate-x-[var(--htx)] group-hover:translate-y-[var(--hty)] ${textClassName}`;

    return (
        <div
            className="group relative inline-block"
            style={{ padding: `0 ${30 * scale}px` }}
        >
            {LAYERS.map((layer, i) => (
                <span
                    key={i}
                    className={layerClass}
                    style={
                        {
                            '--tx': `${layer.x * scale}px`,
                            '--ty': `${layer.y * scale}px`,
                            '--htx': `${layer.hoverX * scale}px`,
                            '--hty': `${layer.hoverY * scale}px`,
                            color: 'transparent',
                            opacity: layerOpacity,
                            WebkitTextStroke: `${layer.stroke}px ${colors[i % colors.length]}`,
                        } as React.CSSProperties
                    }
                    aria-hidden="true"
                >
                    {title}
                </span>
            ))}

            {/* Foreground: sharp, dark text. Only tints on hover for single-color stacks. */}
            <Tag
                className={`relative font-display font-bold text-[#1a1a1a] transition-colors duration-300 ease-out ${colors.length === 1 ? 'group-hover:text-[var(--post-color)]' : ''} ${textClassName}`}
                style={{ '--post-color': colors[0] } as React.CSSProperties}
            >
                {title}
            </Tag>
        </div>
    );
}
