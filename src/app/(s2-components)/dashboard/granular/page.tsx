import Link from "next/link";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { getSlowSummary, getUsers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dashboard (granular)",
};

async function UsersCard() {
  const users = await getUsers();
  return (
    <div className="card p-6">
      <p className="kicker">Users ({users.length})</p>
      <ul className="mt-3 space-y-1">
        {users.map((user) => (
          <li key={user.id} className="text-ink">
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
    <div className="card p-6">
      <p className="kicker">Summary</p>
      <p className="mt-2 text-ink">{summary}</p>
    </div>
  );
}

function CardSkeleton() {
  return <div className="card h-32 animate-pulse bg-surface-3" />;
}

export default function GranularDashboardPage() {
  return (
    <div className="wrap py-12">
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        Dashboard — granular
      </h1>
      <p className="mt-2 text-ink-2">
        Instead of one page-level <code className="icode">loading.tsx</code>,
        each section gets its own{" "}
        <code className="icode">&lt;Suspense&gt;</code> boundary. The fast users
        card (~600ms) appears before the slow summary (~2s) — they stream in
        independently.
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
