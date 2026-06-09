import Link from "next/link";
import { getSlowSummary } from "@/lib/data";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const summary = await getSlowSummary();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-zinc-600">
        This page awaits a deliberately slow fetch (
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          getSlowSummary()
        </code>{" "}
        — 2s). Because{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          dashboard/loading.tsx
        </code>{" "}
        exists, Next.js shows the skeleton instantly and streams this content in
        when the data resolves.
      </p>

      <div className="mt-8 rounded-lg border border-zinc-200 p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Summary
        </p>
        <p className="mt-2 text-zinc-800">{summary}</p>
      </div>

      <p className="mt-8 text-sm text-zinc-500">
        Want finer control?{" "}
        <Link
          href="/dashboard/granular"
          className="font-medium text-zinc-900 underline underline-offset-2"
        >
          /dashboard/granular
        </Link>{" "}
        streams individual sections with explicit{" "}
        <code className="font-mono text-sm">&lt;Suspense&gt;</code> boundaries.
      </p>
    </div>
  );
}
