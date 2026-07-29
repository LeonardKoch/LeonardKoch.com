import type { ReactNode } from 'react';
import {
    AppWindow,
    Badge,
    Box,
    BrokenWire,
    Bulb,
    Frame,
    Gear,
    Junction,
    Panel,
    Question,
    Spark,
    Stack,
    Stroke,
    Target,
    Terminal,
    head,
} from './sketch';

/**
 * The two diagrams for "Skill-Gap induced AI Awe" — wordless on purpose. Each
 * is the same drawing twice: a before panel where some of the work can't
 * happen, and an after panel where all of it runs.
 */

const W = 460;
const H = 400;

function Figure({ children }: { children: ReactNode }) {
    return (
        <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {children}
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * Diagram 1 — four parallel paths, two of which nobody could finish
 * ------------------------------------------------------------------ */

const LANES = [98, 186, 274, 362];
// Lanes that were already possible without the new primitive.
const RAN_ALREADY = [true, false, true, false];

const BAR_Y = 143;
const STEP_Y = 185;
const STEP_SIZE = 66;
const STEP_BOTTOM = STEP_Y + STEP_SIZE;
const TERMINAL_Y = 335;

function Pipelines({ solved }: { solved: boolean }) {
    const flow = solved ? 'green' : 'ink';
    return (
        <>
            <Frame width={W} height={H} />

            {/* One source, fanned out across the lanes. */}
            <Box x={190} y={47} w={80} h={60} />
            <Stack x={230} y={77} />
            <Stroke d={`M230 107 V${BAR_Y}`} tone={flow} />
            <Stroke d={`M${LANES[0]} ${BAR_Y} H${LANES[3]}`} tone={flow} />
            <Junction x={230} y={BAR_Y} tone={flow} />
            <Junction x={LANES[1]} y={BAR_Y} tone={flow} />
            <Junction x={LANES[2]} y={BAR_Y} tone={flow} />
            {LANES.map((x) => (
                <Stroke
                    key={x}
                    d={`M${x} ${BAR_Y} V${STEP_Y} ${head(x, STEP_Y, 'down')}`}
                    tone={flow}
                />
            ))}

            {LANES.map((x, i) => {
                const works = solved || RAN_ALREADY[i];
                return (
                    <Box
                        key={x}
                        x={x - STEP_SIZE / 2}
                        y={STEP_Y}
                        w={STEP_SIZE}
                        h={STEP_SIZE}
                        tone={works ? flow : 'red'}
                        dashed={!works}
                    />
                );
            })}

            {/* A step that already had an answer keeps its cog; the two that
                didn't sit empty until there is a box to put in them. */}
            {LANES.map((x, i) =>
                RAN_ALREADY[i] ? (
                    <Gear
                        key={x}
                        x={x}
                        y={STEP_Y + STEP_SIZE / 2}
                        tone={flow}
                    />
                ) : solved ? (
                    <Spark key={x} x={x} y={STEP_Y + STEP_SIZE / 2} />
                ) : null,
            )}

            {LANES.map((x, i) =>
                solved || RAN_ALREADY[i] ? (
                    <Stroke
                        key={x}
                        d={`M${x} ${STEP_BOTTOM} V${TERMINAL_Y - 18} ${head(x, TERMINAL_Y - 18, 'down')}`}
                        tone={flow}
                    />
                ) : (
                    <BrokenWire key={x} x={x} from={STEP_BOTTOM} />
                ),
            )}

            {LANES.map((x, i) => {
                const reached = solved || RAN_ALREADY[i];
                return (
                    <Terminal
                        key={x}
                        x={x}
                        y={TERMINAL_Y}
                        tone={reached ? flow : 'muted'}
                        reached={reached}
                    />
                );
            })}

            {/* Only the lanes that changed get a verdict sticker. */}
            {LANES.map((x, i) =>
                RAN_ALREADY[i] ? null : (
                    <Badge
                        key={x}
                        x={x + STEP_SIZE / 2}
                        y={STEP_Y}
                        kind={solved ? 'check' : 'cross'}
                    />
                ),
            )}
        </>
    );
}

export function PrimitiveDiagram() {
    return (
        <Figure>
            <Panel
                width={W}
                height={H}
                title="Four parallel paths out of one source. Two run through to their end points; the other two are empty, marked with a red cross, and their wires break before they arrive."
            >
                <Pipelines solved={false} />
            </Panel>
            <Panel
                width={W}
                height={H}
                title="The same four paths, now all green and all reaching their end points — the two that were empty are filled by a new kind of step."
            >
                <Pipelines solved />
            </Panel>
        </Figure>
    );
}

/* ------------------------------------------------------------------ *
 * Diagram 2 — loose ends that never met in the middle
 * ------------------------------------------------------------------ */

const ROWS = [73, 157, 241];
const SRC_X = 40;
const MID_X = 232;
const CELL = 76;
const CELL_H = 66;
const BUS_X = 400;
const OUT = { x: 180, y: 302, w: 120, h: 62 };
const OUT_MID = OUT.x + OUT.w / 2;

const SOURCE_ICONS = [Bulb, Stack, Target];

// A box with its right-hand side ripped off.
const TORN = `M${MID_X + 8} 124 H308 L294 135 L310 146 L293 157 L309 168 L292 179 L306 190 H${MID_X + 8} A8 8 0 0 1 ${MID_X} 182 V132 A8 8 0 0 1 ${MID_X + 8} 124 Z`;

function LooseEnds({ solved }: { solved: boolean }) {
    const tone = solved ? 'ink' : 'red';
    return (
        <>
            <Frame width={W} height={H} />

            {ROWS.map((y, i) => {
                const Icon = SOURCE_ICONS[i];
                return (
                    <g key={y}>
                        <Box
                            x={SRC_X}
                            y={y - CELL_H / 2}
                            w={CELL}
                            h={CELL_H}
                            tone={tone}
                        />
                        <Icon x={SRC_X + CELL / 2} y={y} tone={tone} />
                    </g>
                );
            })}

            {solved ? (
                <>
                    {ROWS.map((y) => (
                        <g key={y}>
                            <Box
                                x={MID_X}
                                y={y - CELL_H / 2}
                                w={CELL}
                                h={CELL_H}
                                tone="green"
                            />
                            <Spark x={MID_X + CELL / 2} y={y} />
                            <Stroke
                                d={`M${SRC_X + CELL} ${y} H${MID_X} ${head(MID_X, y, 'right')}`}
                            />
                            <Stroke
                                d={`M${MID_X + CELL} ${y} H${BUS_X}`}
                                tone="green"
                            />
                        </g>
                    ))}
                    {/* Every output taps the same line down to the result. */}
                    <Stroke
                        d={`M${BUS_X} ${ROWS[0]} V319 Q${BUS_X} 333 386 333 H${OUT.x + OUT.w} ${head(OUT.x + OUT.w, 333, 'left')}`}
                        tone="green"
                    />
                    <Junction x={BUS_X} y={ROWS[1]} tone="green" />
                    <Junction x={BUS_X} y={ROWS[2]} tone="green" />
                </>
            ) : (
                <>
                    {/* Wires that trail off, and a box nobody could finish. */}
                    <Stroke
                        d={`M${SRC_X + CELL} ${ROWS[0]} H190`}
                        tone="red"
                        dashed
                    />
                    <Stroke
                        d={`M${SRC_X + CELL} ${ROWS[1]} H${MID_X}`}
                        tone="red"
                        dashed
                    />
                    <Stroke
                        d={`M${SRC_X + CELL} ${ROWS[2]} H190`}
                        tone="red"
                        dashed
                    />
                    <Question x={220} y={ROWS[0]} />
                    <Question x={220} y={ROWS[2]} />
                    <Stroke d={TORN} tone="red" filled />
                </>
            )}

            <Box
                x={OUT.x}
                y={OUT.y}
                w={OUT.w}
                h={OUT.h}
                tone={tone}
                dashed={!solved}
            />
            <AppWindow x={OUT_MID} y={OUT.y + OUT.h / 2} tone={tone} />
            <Badge
                x={OUT.x + OUT.w}
                y={OUT.y}
                kind={solved ? 'check' : 'cross'}
            />
        </>
    );
}

export function LooseEndsDiagram() {
    return (
        <Figure>
            <Panel
                width={W}
                height={H}
                title="Three starting points whose wires trail off into question marks and a torn box, with nothing reaching the result at the bottom."
            >
                <LooseEnds solved={false} />
            </Panel>
            <Panel
                width={W}
                height={H}
                title="The same three starting points, each now passing through a new kind of step and joining one line into a result that runs."
            >
                <LooseEnds solved />
            </Panel>
        </Figure>
    );
}
