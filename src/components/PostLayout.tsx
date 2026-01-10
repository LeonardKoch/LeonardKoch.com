import { Link } from '@tanstack/react-router'
import { DotPaperBackground } from './DotPaperBackground'
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
    <article className="w-full max-w-[1024px] mx-auto px-4 md:px-8 py-12">
      {/* Title Area with prominent dot pattern */}
      <header className="relative py-12 mb-8 overflow-hidden">
        <DotPaperBackground color={meta.color} variant="header" />
        <div className="relative z-10">
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
          <time className="block mt-4 text-gray-500 font-light text-sm">
            {formatDate(meta.date)}
          </time>
        </div>
      </header>

      {/* Content Area with faint dots */}
      <div className="relative">
        <DotPaperBackground color={meta.color} variant="content" />
        <div className="relative z-10 prose-blog">{children}</div>
      </div>
    </article>
  )
}
