import Link from "next/link";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">About this repo</h1>
      <p className="mt-4 text-zinc-600 leading-7">
        This file is{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          src/app/(s1-routing)/about/page.tsx
        </code>
        . The{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          (s1-routing)
        </code>{" "}
        folder is a route group — it organizes Session 1 demos without adding a
        URL segment. The route is simply{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          /about
        </code>
        .
      </p>
      <p className="mt-4 text-zinc-600 leading-7">
        No data fetching here — just a server component that renders HTML on
        each request.
      </p>
    </div>
  );
}
