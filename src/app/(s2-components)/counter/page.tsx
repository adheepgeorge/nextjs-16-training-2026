import Link from "next/link";
import { Counter } from "./counter";

export const metadata = {
  title: "Counter",
};

export default function CounterPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">The 'use client' boundary</h1>
      <p className="mt-2 text-zinc-600">
        This page is a Server Component — all this text renders on the server.
        Only the interactive button below lives in{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          counter.tsx
        </code>
        , which is marked{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          'use client'
        </code>
        . Keep the client boundary at the leaves: ship JS only where you truly
        need state and events.
      </p>

      <div className="mt-8 max-w-xs">
        <Counter />
      </div>

      <p className="mt-8 text-sm text-zinc-500">
        <code className="font-mono">useState</code> + an{" "}
        <code className="font-mono">onClick</code> handler require the browser,
        so this leaf opts in to client rendering — the page around it does not.
      </p>
    </div>
  );
}
