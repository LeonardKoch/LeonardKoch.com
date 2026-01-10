interface TitleStackProps {
  title: string
  color: string
}

export function TitleStack({ title, color }: TitleStackProps) {
  return (
    <div className="relative inline-block">
      {/* Layer 2: Most blur, lowest opacity - offset slightly */}
      <span
        className="absolute inset-0 font-cursive text-5xl md:text-6xl lg:text-7xl whitespace-nowrap"
        style={{
          color,
          filter: 'blur(4px)',
          opacity: 0.25,
          transform: 'translate(3px, 3px)',
        }}
        aria-hidden="true"
      >
        {title}
      </span>

      {/* Layer 1: Medium blur - offset slightly less */}
      <span
        className="absolute inset-0 font-cursive text-5xl md:text-6xl lg:text-7xl whitespace-nowrap"
        style={{
          color,
          filter: 'blur(2px)',
          opacity: 0.5,
          transform: 'translate(1px, 1px)',
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
