import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="wrap py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Post not found</h1>
      <p className="mt-3 text-ink-2">
        This UI comes from{" "}
        <code className="icode">blog/[slug]/not-found.tsx</code> when the page
        calls <code className="icode">notFound()</code>.
      </p>
      <Link href="/blog" className="link mt-6 inline-block text-sm font-medium">
        ← Back to blog
      </Link>
    </div>
  );
}
