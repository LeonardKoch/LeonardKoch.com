import type { ReactNode } from 'react';
import { FullBleed } from './FullBleed';

interface HeroProps {
    children: ReactNode;
    /** Optional eyebrow/kicker shown above the heading. */
    kicker?: string;
    /** Background color; defaults to a soft slate band. */
    background?: string;
}

/**
 * A full-width intro/section band. Good for setting off a headline statement
 * across the width of the post.
 */
export function Hero({ children, kicker, background = '#f1f5f9' }: HeroProps) {
    return (
        <FullBleed background={background} className="hero-band">
            {kicker && <p className="hero-kicker">{kicker}</p>}
            <div className="hero-content">{children}</div>
        </FullBleed>
    );
}
