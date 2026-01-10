import { createFileRoute } from '@tanstack/react-router'
import { posts } from '../posts'
import { PostLayout } from '../components/PostLayout'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen">
      {posts.map((post) => (
        <PostLayout key={post.meta.slug} meta={post.meta}>
          <post.Component />
        </PostLayout>
      ))}
    </div>
  )
}
