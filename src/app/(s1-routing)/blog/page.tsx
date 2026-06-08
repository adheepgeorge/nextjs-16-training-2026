import Link from "next/link";
import { getPosts } from "@/lib/data";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">Blog</h1>
      <p className="mt-2 text-zinc-600">
        Posts load from{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          src/lib/data.ts
        </code>{" "}
        with an artificial delay so{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          loading.tsx
        </code>{" "}
        is visible.
      </p>
      <ul className="mt-8 space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
            >
              <h2 className="font-medium">{post.title}</h2>
              <p className="mt-1 text-sm text-zinc-600">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
