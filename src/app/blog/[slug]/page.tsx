import { blogs } from '../data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogs.find(b => b.slug === params.slug);

  if (!post) {
    return (
      <main className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-[#a656c2] mb-4">404 – Blog Post Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find the article you're looking for.</p>
        <Link href="/blog" className="bg-[#a656c2] text-white px-4 py-2 rounded">Back to Blog</Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#453670] mb-4">{post.title}</h1>
      <div className="text-[#9b999a] mb-6">{post.meta}</div>
      <article className="prose prose-neutral prose-h2:text-[#a656c2] max-w-none text-base text-[#453670] mb-8 whitespace-pre-line">
        {post.body}
      </article>
      <Link href="/blog" className="bg-[#a656c2] text-white px-4 py-2 rounded">← All Blog Posts</Link>
    </main>
  );
}
