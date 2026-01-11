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
    <article className="w-full max-w-[1024px] mx-auto py-12">
      {/* Full-width dot pattern container that extends beyond text */}
      <div className="relative">
        {/* Dot pattern extends beyond the content with extra horizontal space */}
        <div className="absolute inset-0 -left-8 -right-8 md:-left-16 md:-right-16">
          <DotPaperBackground color={meta.color} variant="title" />
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
      </div>

      {/* Content Area with faint continuous dots */}
      <div className="relative">
        {/* Dot pattern extends beyond the content */}
        <div className="absolute inset-0 -left-8 -right-8 md:-left-16 md:-right-16">
          <DotPaperBackground color={meta.color} variant="content" />
        </div>
        <div className="relative z-10 px-4 md:px-8 pb-8">
          <div className="prose-blog ml-[30px]">{children}</div>
        </div>
      </div>
    </article>
  )
}
