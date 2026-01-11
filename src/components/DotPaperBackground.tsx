interface DotPaperBackgroundProps {
  color: string
  className?: string
  variant?: 'title' | 'content'
}

export function DotPaperBackground({
  color,
  className = '',
  variant = 'title',
}: DotPaperBackgroundProps) {
  const variantClasses =
    variant === 'title' ? 'dot-paper dot-paper-title' : 'dot-paper dot-paper-faint'

  return (
    <div
      className={`absolute inset-0 ${variantClasses} ${className}`}
      style={{ '--dot-color': color } as React.CSSProperties}
    />
  )
}
