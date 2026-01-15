import { Code } from '../components/Code';

export const meta = {
    slug: 'hello-world',
    title: 'Hello World',
    date: '2026-01-11',
    color: '#c14444',
    description:
        "Welcome to my blog! An introduction to what I'll be writing about and the tech stack behind this site.",
};

export default function HelloWorld() {
    return (
        <>
            <p>
                Welcome to my blog! This is the first post, built with TanStack
                Start and styled with a unique dot-paper aesthetic.
            </p>

            <h2>What is this blog about?</h2>
            <p>
                I'll be writing about software engineering, web development, and
                whatever interesting problems I encounter along the way.
            </p>

            <h2>Technical Stack</h2>
            <p>This blog is built with:</p>
            <ul>
                <li>
                    <strong>TanStack Start</strong> - A full-stack React
                    framework with file-based routing
                </li>
                <li>
                    <strong>Bun</strong> - A fast JavaScript runtime
                </li>
                <li>
                    <strong>Tailwind CSS</strong> - For styling with utility
                    classes
                </li>
            </ul>

            <h2>Code Example</h2>
            <p>Here's a simple TypeScript function:</p>
            <Code lang="typescript">{`function greet(name: string): string {
  return \`Hello, \${name}!\`
}

console.log(greet('World'))`}</Code>

            <p>
                Stay tuned for more posts! You can find me on the social links
                above.
            </p>
        </>
    );
}
