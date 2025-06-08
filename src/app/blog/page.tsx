import Link from 'next/link';
import { blogs } from './data';

export default function BlogIndex() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#a656c2] mb-8">Face Shape & Style Blog</h1>
      <div className="space-y-8">
        {blogs.map(b => (
          <article key={b.slug} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-[#453670]">{b.title}</h2>
            <p className="text-[#9b999a] my-3">{b.blurb}</p>
            <Link
              className="inline-block px-4 py-2 mt-2 rounded bg-[#a656c2] text-white hover:bg-[#453670] text-sm font-medium shadow-sm"
              href={`/blog/${b.slug}`}
            >Read full post</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
