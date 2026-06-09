import Link from "next/link";
import { Suspense } from "react";
import { getSlowSummary, getUsers } from "@/lib/data";

export const metadata = {
  title: "Dashboard (granular)",
};

async function UsersCard() {
  const users = await getUsers();
  return (
    <div className="rounded-lg border border-zinc-200 p-6">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
        Users ({users.length})
      </p>
      <ul className="mt-3 space-y-1">
        {users.map((user) => (
          <li key={user.id} className="text-zinc-800">
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

async function SummaryCard() {
  const summary = await getSlowSummary();
  return (
    <div className="rounded-lg border border-zinc-200 p-6">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
        Summary
      </p>
      <p className="mt-2 text-zinc-800">{summary}</p>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="h-32 animate-pulse rounded-lg border border-zinc-200 bg-zinc-50" />
  );
}

export default function GranularDashboardPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">Dashboard — granular</h1>
      <p className="mt-2 text-zinc-600">
        Instead of one page-level{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          loading.tsx
        </code>
        , each section gets its own{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          &lt;Suspense&gt;
        </code>{" "}
        boundary. The fast users card (~600ms) appears before the slow summary
        (~2s) — they stream in independently.
      </p>

      <div className="mt-8 space-y-4">
        <Suspense fallback={<CardSkeleton />}>
          <UsersCard />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <SummaryCard />
        </Suspense>
      </div>
    </div>
  );
}
