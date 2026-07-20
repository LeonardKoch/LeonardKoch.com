import type { CSSProperties, ReactNode } from 'react';

interface FullBleedProps {
    children: ReactNode;
    /** Background color for the band (any CSS color). */
    background?: string;
    /** Text color override. */
    color?: string;
    className?: string;
    style?: CSSProperties;
}

/**
 * A horizontal section that spans the full width of the post content column.
 * It sheds the prose left-indent and content padding via the `.full-bleed`
 * rule in styles.css, but stays clamped inside the article's max width — it
 * never breaks out to the viewport.
 */
export function FullBleed({
    children,
    background,
    color,
    className = '',
    style,
}: FullBleedProps) {
    return (
        <div
            className={`full-bleed ${className}`}
            style={{ background, color, ...style }}
        >
            <div className="full-bleed-inner">{children}</div>
        </div>
    );
}
