import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Post not found</h1>
      <p className="mt-3 text-zinc-600">
        This UI comes from{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          blog/[slug]/not-found.tsx
        </code>{" "}
        when the page calls{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          notFound()
        </code>
        .
      </p>
      <Link
        href="/blog"
        className="mt-6 inline-block text-sm font-medium text-zinc-900 hover:underline"
      >
        ← Back to blog
      </Link>
    </div>
  );
}
