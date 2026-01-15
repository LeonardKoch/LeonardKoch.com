import { createHighlighter } from 'shiki';
import { useEffect, useState } from 'react';

interface CodeProps {
    children: string;
    lang?: string;
}

// Light theme colors that fit the blog aesthetic
const theme = {
    name: 'blog-light',
    type: 'light' as const,
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

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
    if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
            themes: [theme],
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
        });
    }
    return highlighterPromise;
}

export function Code({ children, lang = 'typescript' }: CodeProps) {
    const [html, setHtml] = useState<string | null>(null);
    const code = children.trim();

    useEffect(() => {
        getHighlighter().then((highlighter) => {
            const highlighted = highlighter.codeToHtml(code, {
                lang,
                theme: 'blog-light',
            });
            setHtml(highlighted);
        });
    }, [code, lang]);

    if (!html) {
        // Fallback while loading
        return (
            <pre className="shiki-fallback">
                <code>{code}</code>
            </pre>
        );
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
