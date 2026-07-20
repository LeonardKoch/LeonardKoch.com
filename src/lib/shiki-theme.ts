import type { ThemeRegistrationRaw } from 'shiki';

// Light theme colors that fit the blog aesthetic.
// Shared by the build-time rehype-shiki plugin (see vite.config.ts) so code is
// highlighted at build with no client-side JavaScript.
export const blogLightTheme: ThemeRegistrationRaw = {
    name: 'blog-light',
    type: 'light',
    colors: {
        'editor.background': '#f1f5f9',
        'editor.foreground': '#334155',
    },
    settings: [
        {
            scope: ['comment', 'punctuation.definition.comment'],
            settings: { foreground: '#94a3b8', fontStyle: 'italic' },
        },
        {
            scope: ['string', 'string.quoted'],
            settings: { foreground: '#059669' },
        },
        {
            scope: ['constant.numeric', 'constant.language'],
            settings: { foreground: '#d97706' },
        },
        {
            scope: ['keyword', 'storage.type', 'storage.modifier'],
            settings: { foreground: '#7c3aed' },
        },
        {
            scope: ['entity.name.function', 'support.function'],
            settings: { foreground: '#2563eb' },
        },
        {
            scope: [
                'entity.name.type',
                'entity.name.class',
                'support.type',
                'support.class',
            ],
            settings: { foreground: '#0891b2' },
        },
        {
            scope: ['variable', 'variable.other'],
            settings: { foreground: '#334155' },
        },
        {
            scope: ['variable.parameter'],
            settings: { foreground: '#b45309' },
        },
        {
            scope: ['entity.name.tag'],
            settings: { foreground: '#dc2626' },
        },
        {
            scope: ['entity.other.attribute-name'],
            settings: { foreground: '#7c3aed' },
        },
        {
            scope: ['punctuation', 'meta.brace'],
            settings: { foreground: '#64748b' },
        },
        {
            scope: ['keyword.operator'],
            settings: { foreground: '#be185d' },
        },
    ],
};
