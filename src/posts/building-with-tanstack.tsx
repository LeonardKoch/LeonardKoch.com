import { Code } from '../components/Code'

export const meta = {
  slug: 'building-with-tanstack',
  title: 'Building with TanStack Start',
  date: '2026-01-10',
  color: '#10b981',
  description: 'Why I chose TanStack Start for this blog: file-based routing, end-to-end type safety, and powerful server functions.',
}

export default function BuildingWithTanStack() {
  return (
    <>
      <p>
        TanStack Start is a full-stack React framework that makes building modern
        web applications a joy. Here's why I chose it for this blog.
      </p>

      <h2>File-Based Routing</h2>
      <p>
        Routes are defined by the file structure in your <code>src/routes</code>{' '}
        folder. Create a file, and you have a route. It's that simple.
      </p>
      <Code lang="bash">{`src/routes/
├── __root.tsx      # Root layout
├── index.tsx       # Home page (/)
└── post/
    └── $slug.tsx   # Dynamic route (/post/:slug)`}</Code>

      <h2>Type Safety Everywhere</h2>
      <p>
        TanStack Router provides end-to-end type safety. Your route params, loader
        data, and search params are all fully typed. No more runtime errors from
        typos in route names.
      </p>

      <h2>Server Functions</h2>
      <p>
        Need to run code on the server? Just use <code>createServerFn</code> and
        call it from your components. No API routes needed for simple operations.
      </p>
      <Code lang="typescript">{`import { createServerFn } from '@tanstack/react-start'

const getData = createServerFn('GET', async () => {
  // This runs on the server
  return { message: 'Hello from the server!' }
})`}</Code>

      <p>
        The combination of these features makes TanStack Start perfect for content
        sites, dashboards, and full applications alike.
      </p>
    </>
  )
}
