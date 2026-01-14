interface TitleStackProps {
  title: string
  color: string
}

export function TitleStack({ title, color }: TitleStackProps) {
  return (
    <div className="relative inline-block px-[30px]">
      {/* Layer 5: Furthest outline - top-left */}
      <span
        className="absolute font-display text-4xl md:text-5xl lg:text-6xl font-bold whitespace-nowrap pointer-events-none select-none"
        style={{
          color: 'transparent',
          WebkitTextStroke: `0.5px ${color}`,
          transform: 'translate(-12px, -12px)',
        }}
        aria-hidden="true"
      >
        {title}
      </span>

      {/* Layer 4 */}
      <span
        className="absolute font-display text-4xl md:text-5xl lg:text-6xl font-bold whitespace-nowrap pointer-events-none select-none"
        style={{
          color: 'transparent',
          WebkitTextStroke: `0.75px ${color}`,
          transform: 'translate(-9px, -9px)',
        }}
        aria-hidden="true"
      >
        {title}
      </span>

      {/* Layer 3 */}
      <span
        className="absolute font-display text-4xl md:text-5xl lg:text-6xl font-bold whitespace-nowrap pointer-events-none select-none"
        style={{
          color: 'transparent',
          WebkitTextStroke: `1px ${color}`,
          transform: 'translate(-6px, -6px)',
        }}
        aria-hidden="true"
      >
        {title}
      </span>

      {/* Layer 2 */}
      <span
        className="absolute font-display text-4xl md:text-5xl lg:text-6xl font-bold whitespace-nowrap pointer-events-none select-none"
        style={{
          color: 'transparent',
          WebkitTextStroke: `1.5px ${color}`,
          transform: 'translate(-3px, -3px)',
        }}
        aria-hidden="true"
      >
        {title}
      </span>

      {/* Foreground: Sharp, dark text */}
      <h1 className="relative font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a]">
        {title}
      </h1>
    </div>
  )
}
