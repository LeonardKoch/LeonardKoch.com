import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';
import rehypeShiki from '@shikijs/rehype';
import { blogLightTheme } from './src/lib/shiki-theme';

const config = defineConfig({
    plugins: [
        devtools(),
        nitro(),
        // this is the plugin that enables path aliases
        viteTsConfigPaths({
            projects: ['./tsconfig.json'],
        }),
        tailwindcss(),
        // MDX must compile before the React plugin runs.
        {
            enforce: 'pre',
            ...mdx({
                // Author section components without importing them (see
                // src/components/mdx/provider.tsx).
                providerImportSource: '@mdx-js/react',
                remarkPlugins: [
                    remarkFrontmatter,
                    [remarkMdxFrontmatter, { name: 'frontmatter' }],
                    remarkGfm,
                ],
                rehypePlugins: [
                    [
                        rehypeShiki,
                        {
                            theme: blogLightTheme,
                            // Languages the posts actually use.
                            langs: [
                                'typescript',
                                'javascript',
                                'tsx',
                                'jsx',
                                'bash',
                                'json',
                                'css',
                                'html',
                            ],
                        },
                    ],
                ],
            }),
        },
        // Posts are server-rendered on demand (node-server preset). Because
        // code is highlighted at build time (rehype-shiki above) and bodies
        // are real SSR, pages ship complete HTML with no client-side flash —
        // so static prerendering isn't needed here.
        tanstackStart(),
        // Ensure the React plugin also transforms compiled .mdx output.
        viteReact({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
    ],
});

export default config;
