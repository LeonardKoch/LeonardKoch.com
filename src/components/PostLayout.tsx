import { Link } from '@tanstack/react-router'
import { TitleStack } from './TitleStack'
import type { PostMeta } from '../posts'

interface PostLayoutProps {
  meta: PostMeta
  children: React.ReactNode
  isFullPage?: boolean
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function PostLayout({ meta, children, isFullPage = false }: PostLayoutProps) {
  return (
    <article className="w-full max-w-[1024px] mx-auto py-12 relative">
      {/* Header dot pattern - stronger intensity */}
      <div className="absolute -left-8 -right-8 md:-left-16 md:-right-16 top-0 h-[220px]">
        <div
          className="absolute inset-0 dot-paper dot-paper-header"
          style={{ '--dot-color': meta.color } as React.CSSProperties}
        />
      </div>

      {/* Content dot pattern - faint with cutout around text */}
      <div className="absolute -left-8 -right-8 md:-left-16 md:-right-16 top-[180px] bottom-0">
        <div
          className="absolute inset-0 dot-paper dot-paper-content"
          style={{ '--dot-color': meta.color, backgroundPosition: '0 -180px' } as React.CSSProperties}
        />
      </div>

      {/* Title Area */}
      <header className="relative z-10 pt-16 pb-12 px-4 md:px-8">
        {isFullPage ? (
          <div>
            <TitleStack title={meta.title} color={meta.color} />
          </div>
        ) : (
          <Link
            to="/post/$slug"
            params={{ slug: meta.slug }}
            className="block hover:opacity-80 transition-opacity"
          >
            <TitleStack title={meta.title} color={meta.color} />
          </Link>
        )}
        <time className="block mt-4 ml-[30px] text-gray-500 font-light text-sm">
          {formatDate(meta.date)}
        </time>
      </header>

      {/* Content Area */}
      <div className="relative z-10 px-4 md:px-8 pb-8">
        <div className="prose-blog ml-[30px]">{children}</div>
      </div>
    </article>
  )
}
