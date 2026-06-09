import Link from "next/link";
import type { Metadata } from "next/types";
import { Counter } from "./counter";

export const metadata: Metadata = {
  title: "Counter",
};

export default function CounterPage() {
  return (
    <div className="wrap py-12">
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        The 'use client' boundary
      </h1>
      <p className="mt-2 text-ink-2">
        This page is a Server Component — all this text renders on the server.
        Only the interactive button below lives in{" "}
        <code className="icode">counter.tsx</code>, which is marked{" "}
        <code className="icode">'use client'</code>. Keep the client boundary at
        the leaves: ship JS only where you truly need state and events.
      </p>

      <div className="mt-8 max-w-xs">
        <Counter />
      </div>

      <p className="mt-8 text-sm text-ink-3">
        <code className="icode">useState</code> + an{" "}
        <code className="icode">onClick</code> handler require the browser, so
        this leaf opts in to client rendering — the page around it does not.
      </p>
    </div>
  );
}
