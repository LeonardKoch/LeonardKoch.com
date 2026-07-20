import type { ReactNode } from 'react';
import { FullBleed } from './FullBleed';

interface SplitProps {
    children: ReactNode;
    background?: string;
}

/**
 * A full-width two-column section. Pass exactly two children (e.g. two <div>s
 * or paragraphs); they stack on small screens and sit side by side on wide
 * ones.
 */
export function Split({ children, background }: SplitProps) {
    return (
        <FullBleed background={background} className="split-band">
            <div className="split-grid">{children}</div>
        </FullBleed>
    );
}
