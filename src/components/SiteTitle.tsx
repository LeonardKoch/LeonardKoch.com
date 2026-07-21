interface SiteTitleProps {
    title: string;
    color: string;
}

// At rest the echoes cascade up to the right; on hover they scatter around the
// title the way the post title stack does.
const ECHOES = [
    { x: 24, y: -9, hoverX: 14, hoverY: -10, stroke: 0.5 },
    { x: 16, y: -6, hoverX: -12, hoverY: 6, stroke: 0.75 },
    { x: 8, y: -3, hoverX: 7, hoverY: 9, stroke: 1 },
];

export function SiteTitle({ title, color }: SiteTitleProps) {
    const echoClass =
        'absolute left-0 top-0 text-2xl font-display font-bold whitespace-nowrap pointer-events-none select-none transition-transform duration-300 ease-out translate-x-[var(--tx)] translate-y-[var(--ty)] group-hover:translate-x-[var(--htx)] group-hover:translate-y-[var(--hty)]';

    return (
        <span className="group relative inline-block">
            {ECHOES.map((echo, i) => (
                <span
                    key={i}
                    className={echoClass}
                    style={
                        {
                            '--tx': `${echo.x}px`,
                            '--ty': `${echo.y}px`,
                            '--htx': `${echo.hoverX}px`,
                            '--hty': `${echo.hoverY}px`,
                            color: 'transparent',
                            WebkitTextStroke: `${echo.stroke}px ${color}`,
                        } as React.CSSProperties
                    }
                    aria-hidden="true"
                >
                    {title}
                </span>
            ))}

            {/* Foreground: sharp, dark text that tints on hover. */}
            <span
                className="relative text-2xl font-display font-bold text-[#1a1a1a] transition-colors duration-300 ease-out group-hover:text-[var(--title-color)]"
                style={{ '--title-color': color } as React.CSSProperties}
            >
                {title}
            </span>
        </span>
    );
}
