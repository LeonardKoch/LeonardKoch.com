interface TitleStackProps {
  title: string
  color: string
}

export function TitleStack({ title, color }: TitleStackProps) {
  return (
    <div className="relative inline-block px-[30px]">
      {/* Layer 2: Outer echo - more blur, lower opacity, scaled up */}
      <span
        className="absolute inset-0 font-display text-4xl md:text-5xl lg:text-6xl font-bold whitespace-nowrap pointer-events-none select-none"
        style={{
          color,
          filter: 'blur(6px)',
          opacity: 0.15,
          transform: 'scale(1.08)',
          transformOrigin: 'left center',
        }}
        aria-hidden="true"
      >
        {title}
      </span>

      {/* Layer 1: Inner echo - light blur, slightly more visible */}
      <span
        className="absolute inset-0 font-display text-4xl md:text-5xl lg:text-6xl font-bold whitespace-nowrap pointer-events-none select-none"
        style={{
          color,
          filter: 'blur(3px)',
          opacity: 0.25,
          transform: 'scale(1.03)',
          transformOrigin: 'left center',
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
