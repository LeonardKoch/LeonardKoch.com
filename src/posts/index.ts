import HelloWorldPost, { meta as helloWorldMeta } from './hello-world'
import BuildingWithTanStackPost, { meta as buildingWithTanStackMeta } from './building-with-tanstack'
import TheJoyOfBunPost, { meta as theJoyOfBunMeta } from './the-joy-of-bun'

export interface PostMeta {
  slug: string
  title: string
  date: string
  color: string
  description: string
}

export interface Post {
  meta: PostMeta
  Component: React.ComponentType
}

// Array of all posts, sorted by date (newest first)
export const posts: Post[] = [
  { meta: helloWorldMeta, Component: HelloWorldPost },
  { meta: buildingWithTanStackMeta, Component: BuildingWithTanStackPost },
  { meta: theJoyOfBunMeta, Component: TheJoyOfBunPost },
].sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())

// Helper to find a post by slug
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.meta.slug === slug)
}
