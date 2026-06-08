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
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back to blog
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">{post.title}</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Slug: <code className="rounded bg-zinc-100 px-1.5 py-0.5">{slug}</code>
      </p>
      <p className="mt-6 text-zinc-700 leading-7">{post.content}</p>
      <p className="mt-8 text-sm text-zinc-500">
        Check the browser tab title — it came from{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          generateMetadata
        </code>{" "}
        using{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          await params
        </code>{" "}
        (v16: params is a Promise).
      </p>
    </article>
  );
}
