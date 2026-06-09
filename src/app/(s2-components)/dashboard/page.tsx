import Link from "next/link";
import type { Metadata } from "next/types";
import { getSlowSummary } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const summary = await getSlowSummary();

  return (
    <div className="wrap py-12">
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-ink-2">
        This page awaits a deliberately slow fetch (
        <code className="icode">getSlowSummary()</code> — 2s). Because{" "}
        <code className="icode">dashboard/loading.tsx</code> exists, Next.js
        shows the skeleton instantly and streams this content in when the data
        resolves.
      </p>

      <div className="card mt-8 p-6">
        <p className="kicker">Summary</p>
        <p className="mt-2 text-ink">{summary}</p>
      </div>

      <p className="mt-8 text-sm text-ink-3">
        Want finer control?{" "}
        <Link href="/dashboard/granular" className="link font-medium">
          /dashboard/granular
        </Link>{" "}
        streams individual sections with explicit{" "}
        <code className="icode">&lt;Suspense&gt;</code> boundaries.
      </p>
    </div>
  );
}
