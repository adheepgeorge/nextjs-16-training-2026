import Link from "next/link";
import { getPosts } from "@/lib/data";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="wrap py-12">
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-2 text-ink-2">
        Posts load from <code className="icode">src/lib/data.ts</code> with an
        artificial delay so <code className="icode">loading.tsx</code> is
        visible.
      </p>
      <ul className="mt-8 space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="card-link block px-5 py-4"
            >
              <h2 className="font-medium text-ink">{post.title}</h2>
              <p className="mt-1 text-sm text-ink-3">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
