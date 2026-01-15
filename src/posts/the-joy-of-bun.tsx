import { Code } from '../components/Code';

export const meta = {
    slug: 'the-joy-of-bun',
    title: 'The Joy of Bun',
    date: '2026-01-08',
    color: '#3a87d1',
    description:
        "Bun is a fast all-in-one JavaScript runtime, package manager, bundler, and test runner. Here's why it's a game changer.",
};

export default function TheJoyOfBun() {
    return (
        <>
            <p>
                Bun is a fast all-in-one JavaScript runtime. It's not just a
                runtime though — it's a package manager, bundler, and test
                runner all in one.
            </p>

            <h2>Speed That You Can Feel</h2>
            <p>
                The first thing you notice with Bun is the speed. Installing
                packages feels instant. Starting a dev server takes
                milliseconds. It's the kind of speed that changes how you work.
            </p>
            <Code lang="bash">{`# Install dependencies
bun install  # ~500ms vs npm's 10+ seconds

# Run scripts
bun run dev  # Instant startup`}</Code>

            <h2>Native TypeScript Support</h2>
            <p>
                No configuration needed. Just write TypeScript and run it
                directly:
            </p>
            <Code lang="typescript">{`// script.ts
const greeting: string = "Hello, Bun!"
console.log(greeting)`}</Code>
            <Code lang="bash">{`# Run it directly
$ bun script.ts`}</Code>

            <h2>Drop-in Node.js Replacement</h2>
            <p>
                Most Node.js code just works. Bun implements Node's APIs, so you
                can often switch without changing any code. Your existing{' '}
                <code>package.json</code> scripts, dependencies, and tooling
                continue to work.
            </p>

            <h2>Built-in Testing</h2>
            <p>Bun includes a test runner that's compatible with Jest's API:</p>
            <Code lang="typescript">{`import { test, expect } from 'bun:test'

test('addition', () => {
  expect(2 + 2).toBe(4)
})`}</Code>

            <p>
                If you haven't tried Bun yet, give it a shot. The speed alone
                makes it worth the switch.
            </p>
        </>
    );
}
