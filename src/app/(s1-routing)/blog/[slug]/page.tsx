import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === "trigger-error") {
    return { title: "Error demo" };
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "trigger-error") {
    throw new Error("Demo error — caught by blog/error.tsx");
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="wrap py-12">
      <Link href="/blog" className="backlink">
        ← Back to blog
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        {post.title}
      </h1>
      <p className="mt-2 text-sm text-ink-3">
        Slug: <code className="icode">{slug}</code>
      </p>
      <p className="mt-6 leading-7 text-ink-2">{post.content}</p>
      <p className="mt-8 text-sm text-ink-3">
        Check the browser tab title — it came from{" "}
        <code className="icode">generateMetadata</code> using{" "}
        <code className="icode">await params</code> (v16: params is a Promise).
      </p>
    </article>
  );
}
