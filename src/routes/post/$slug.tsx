import { createFileRoute, notFound } from '@tanstack/react-router';
import { getPostBySlug } from '../../posts';
import { PostLayout } from '../../components/PostLayout';

export const Route = createFileRoute('/post/$slug')({
    component: PostPage,
    loader: ({ params }) => {
        const post = getPostBySlug(params.slug);
        if (!post) throw notFound();
        // Loaders must return serializable data, so pass meta only; the post
        // component is looked up again (server and client) when rendering.
        return { meta: post.meta };
    },
    head: ({ loaderData }) => ({
        meta: [
            {
                title: `${loaderData?.meta.title} | LeonardKoch`,
            },
        ],
    }),
});

function PostPage() {
    const { meta } = Route.useLoaderData();
    // Get the full post including component on the client
    const post = getPostBySlug(meta.slug);

    if (!post) return null;

    return (
        <div className="min-h-screen">
            <PostLayout meta={post.meta} isFullPage>
                <post.Component />
            </PostLayout>
        </div>
    );
}
