interface DotPaperBackgroundProps {
  color: string
  className?: string
  variant?: 'header' | 'content'
}

export function DotPaperBackground({
  color,
  className = '',
  variant = 'header',
}: DotPaperBackgroundProps) {
  const baseClasses =
    variant === 'header' ? 'dot-paper dot-paper-gradient' : 'dot-paper dot-paper-faint'

  return (
    <div
      className={`absolute inset-0 ${baseClasses} ${className}`}
      style={{ '--dot-color': color } as React.CSSProperties}
    />
  )
}
