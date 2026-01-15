interface TitleStackProps {
    title: string;
    color: string;
}

export function TitleStack({ title, color }: TitleStackProps) {
    return (
        <div
            className="group relative inline-block px-[30px]"
            style={{ '--post-color': color } as React.CSSProperties}
        >
            {/* Layer 5: Furthest outline */}
            <span
                className="absolute font-display text-4xl md:text-5xl lg:text-6xl font-bold whitespace-nowrap pointer-events-none select-none transition-transform duration-300 ease-out translate-x-[-12px] translate-y-[-12px] group-hover:translate-x-[15px] group-hover:translate-y-[-8px]"
                style={{
                    color: 'transparent',
                    WebkitTextStroke: `0.5px ${color}`,
                }}
                aria-hidden="true"
            >
                {title}
            </span>

            {/* Layer 4 */}
            <span
                className="absolute font-display text-4xl md:text-5xl lg:text-6xl font-bold whitespace-nowrap pointer-events-none select-none transition-transform duration-300 ease-out translate-x-[-9px] translate-y-[-9px] group-hover:translate-x-[-18px] group-hover:translate-y-[5px]"
                style={{
                    color: 'transparent',
                    WebkitTextStroke: `0.75px ${color}`,
                }}
                aria-hidden="true"
            >
                {title}
            </span>

            {/* Layer 3 */}
            <span
                className="absolute font-display text-4xl md:text-5xl lg:text-6xl font-bold whitespace-nowrap pointer-events-none select-none transition-transform duration-300 ease-out translate-x-[-6px] translate-y-[-6px] group-hover:translate-x-[10px] group-hover:translate-y-[10px]"
                style={{
                    color: 'transparent',
                    WebkitTextStroke: `1px ${color}`,
                }}
                aria-hidden="true"
            >
                {title}
            </span>

            {/* Layer 2 */}
            <span
                className="absolute font-display text-4xl md:text-5xl lg:text-6xl font-bold whitespace-nowrap pointer-events-none select-none transition-transform duration-300 ease-out translate-x-[-3px] translate-y-[-3px] group-hover:translate-x-[-8px] group-hover:translate-y-[-15px]"
                style={{
                    color: 'transparent',
                    WebkitTextStroke: `1.5px ${color}`,
                }}
                aria-hidden="true"
            >
                {title}
            </span>

            {/* Foreground: Sharp, dark text */}
            <h1 className="relative font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] transition-colors duration-300 ease-out group-hover:text-[var(--post-color)]">
                {title}
            </h1>
        </div>
    );
}
