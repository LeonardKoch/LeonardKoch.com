interface TitleStackProps {
    title: string;
    color: string;
}

// Furthest layer first.
const LAYERS = [
    { x: -12, y: -12, stroke: 0.5, hoverX: 15, hoverY: -8 },
    { x: -9, y: -9, stroke: 0.75, hoverX: -18, hoverY: 5 },
    { x: -6, y: -6, stroke: 1, hoverX: 10, hoverY: 10 },
    { x: -3, y: -3, stroke: 1.5, hoverX: -8, hoverY: -15 },
];

const TEXT_CLASS = 'text-4xl md:text-5xl lg:text-6xl';

export function TitleStack({ title, color }: TitleStackProps) {
    const layerClass = `absolute font-display font-bold whitespace-nowrap pointer-events-none select-none transition-transform duration-300 ease-out translate-x-[var(--tx)] translate-y-[var(--ty)] group-hover:translate-x-[var(--htx)] group-hover:translate-y-[var(--hty)] ${TEXT_CLASS}`;

    return (
        <div className="group relative inline-block px-[30px]">
            {LAYERS.map((layer, i) => (
                <span
                    key={i}
                    className={layerClass}
                    style={
                        {
                            '--tx': `${layer.x}px`,
                            '--ty': `${layer.y}px`,
                            '--htx': `${layer.hoverX}px`,
                            '--hty': `${layer.hoverY}px`,
                            color: 'transparent',
                            WebkitTextStroke: `${layer.stroke}px ${color}`,
                        } as React.CSSProperties
                    }
                    aria-hidden="true"
                >
                    {title}
                </span>
            ))}

            {/* Foreground: sharp, dark text that tints on hover. */}
            <h1
                className={`relative font-display font-bold text-[#1a1a1a] transition-colors duration-300 ease-out group-hover:text-[var(--post-color)] ${TEXT_CLASS}`}
                style={{ '--post-color': color } as React.CSSProperties}
            >
                {title}
            </h1>
        </div>
    );
}
