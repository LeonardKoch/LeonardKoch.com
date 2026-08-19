import { useId, useState } from 'react';

/**
 * Tesler's law, made draggable.
 *
 * Two bars carry the same total complexity: what the developer takes on and
 * what the user is left with. The horizontal slider moves complexity between
 * them — it never disappears. The vertical slider adds agent capability, which
 * eats into the build side rather than shrinking it: the work is the same
 * amount of work, an agent is just doing most of it. The user's bar stays
 * exactly where the complexity slider left it.
 */

/** Height of the plot area, in px. Shared with the capability slider. */
const TRACK_H = 280;
/** Effort each side carries with the complexity slider centred. */
const BALANCE = 50;
/** How far the complexity slider can push effort either way. */
const SPREAD = 35;
/** The tallest a bar can get, so a maxed-out bar fills the plot exactly. */
const CEILING = BALANCE + SPREAD;
/** Share of the build bar a fully capable agent takes over. */
const AGENT_MAX_SHARE = 0.75;

const PALETTE = {
    dev: { line: '#3f8b62', fill: '#d8e9df', text: '#2f6b4a' },
    agent: { line: '#9aa1ab', fill: '#e4e7ec', text: '#5c636e' },
    user: { line: '#3a6ea8', fill: '#dce8f5', text: '#2d5883' },
} as const;

type Tone = keyof typeof PALETTE;

interface SegmentProps {
    tone: Tone;
    /** Effort carried by this segment, in the same units as CEILING. */
    value: number;
    name: string;
    top: boolean;
    bottom: boolean;
}

function Segment({ tone, value, name, top, bottom }: SegmentProps) {
    const p = PALETTE[tone];
    if (value <= 0.5) return null;
    return (
        <div
            className="flex items-center justify-center gap-1.5 overflow-hidden border-[1.5px] transition-[height] duration-150 ease-out"
            style={{
                height: `${(value / CEILING) * 100}%`,
                background: p.fill,
                borderColor: p.line,
                color: p.text,
                borderTopLeftRadius: top ? 6 : 0,
                borderTopRightRadius: top ? 6 : 0,
                borderBottomLeftRadius: bottom ? 6 : 0,
                borderBottomRightRadius: bottom ? 6 : 0,
            }}
        >
            {/* The name is the only labelling the diagram has, so it stays as
                long as there is a line's worth of room for it. */}
            {(value / CEILING) * TRACK_H >= 20 && (
                <span className="text-xs font-medium">{name}</span>
            )}
        </div>
    );
}

interface BarProps {
    /** Top to bottom, the way they stack. */
    segments: Array<{ tone: Tone; value: number; name: string }>;
}

function Bar({ segments }: BarProps) {
    const drawn = segments.filter((s) => s.value > 0.5);
    return (
        // No gap between segments: the stack has to add up to exactly the plot
        // height so a maxed-out bar lands flush with the top.
        <div
            className="flex min-w-0 flex-1 flex-col justify-end"
            style={{ height: TRACK_H }}
        >
            {drawn.map((s, i) => (
                <Segment
                    key={s.tone}
                    tone={s.tone}
                    value={s.value}
                    name={s.name}
                    top={i === 0}
                    bottom={i === drawn.length - 1}
                />
            ))}
        </div>
    );
}

interface TeslersLawDiagramProps {
    /**
     * Starting position of the complexity slider: 0 puts all of it on the
     * developer, 100 on the user, 50 splits it evenly.
     */
    complexity?: number;
    /** Starting agent capability, 0 (none) to 100. */
    capability?: number;
    /** Whether the reader can move agent capability at all. */
    agent?: boolean;
}

export function TeslersLawDiagram({
    complexity: initialComplexity = 50,
    capability: initialCapability = 0,
    agent: showAgent = true,
}: TeslersLawDiagramProps = {}) {
    // 0 = all complexity pushed onto the developer, 100 = onto the user.
    const [complexity, setComplexity] = useState(initialComplexity);
    const [capability, setCapability] = useState(
        showAgent ? initialCapability : 0,
    );
    const uid = useId();

    // Positive when the product absorbs the complexity instead of the user.
    const shift = (50 - complexity) / 50;
    const build = BALANCE + shift * SPREAD;
    const user = BALANCE - shift * SPREAD;

    const a = capability / 100;
    // The work doesn't shrink because an agent does it — the agent just takes
    // over more and more of the same bar.
    const agent = build * AGENT_MAX_SHARE * a;
    const dev = build - agent;

    return (
        <div className="my-10 rounded-xl border border-[#e4e7ec] bg-white/60 p-5 md:p-6">
            <div className="flex gap-4 md:gap-6">
                <div className="min-w-0 flex-1">
                    <div className="flex items-end gap-4 md:gap-8">
                        <Bar
                            segments={[
                                { tone: 'agent', value: agent, name: 'Agent' },
                                { tone: 'dev', value: dev, name: 'Developer' },
                            ]}
                        />
                        <Bar
                            segments={[
                                { tone: 'user', value: user, name: 'User' },
                            ]}
                        />
                    </div>

                    <div className="mt-6">
                        <label
                            htmlFor={`${uid}-complexity`}
                            className="mb-1.5 block text-xs font-semibold tracking-wide text-[#6b7280] uppercase"
                        >
                            Where the complexity sits
                        </label>
                        <input
                            id={`${uid}-complexity`}
                            className="diagram-slider diagram-slider--centered w-full"
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={complexity}
                            onChange={(e) =>
                                setComplexity(Number(e.target.value))
                            }
                        />
                        <div className="mt-1 flex justify-between text-xs text-[#6b7280]">
                            <span>the product swallows it</span>
                            <span>the user deals with it</span>
                        </div>
                    </div>
                </div>

                {showAgent && (
                    <div className="flex items-start gap-1">
                        {/* A quarter turn rather than a vertical writing mode:
                        rotation behaves the same in every browser, and puts
                        zero capability at the bottom. */}
                        <div
                            className="relative w-[18px] shrink-0"
                            style={{ height: TRACK_H }}
                        >
                            <input
                                id={`${uid}-capability`}
                                className="diagram-slider absolute top-1/2 left-1/2"
                                type="range"
                                min={0}
                                max={100}
                                step={1}
                                value={capability}
                                style={
                                    {
                                        width: TRACK_H,
                                        transform:
                                            'translate(-50%, -50%) rotate(-90deg)',
                                        '--slider-fill': `${capability}%`,
                                    } as React.CSSProperties
                                }
                                onChange={(e) =>
                                    setCapability(Number(e.target.value))
                                }
                            />
                        </div>
                        <label
                            htmlFor={`${uid}-capability`}
                            className="flex items-center justify-center text-xs font-semibold tracking-wide text-[#6b7280] uppercase"
                            style={{
                                height: TRACK_H,
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)',
                            }}
                        >
                            Agent Loop capability
                        </label>
                    </div>
                )}
            </div>

            <div className="sr-only" aria-live="polite">
                Developer time {Math.round(dev)}
                {agent >= 0.5 && `, agent time ${Math.round(agent)}`}, user time{' '}
                {Math.round(user)}.
            </div>
        </div>
    );
}
