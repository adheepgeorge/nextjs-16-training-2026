"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@/lib/data";

export default function UsersClientPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data: User[]) => setUsers(data))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="wrap py-12">
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        Users — Client Component
      </h1>
      <p className="mt-2 text-ink-2">
        This page is marked <code className="icode">'use client'</code>, so it
        can&apos;t import the server-only fetchers in{" "}
        <code className="icode">data.ts</code>. Instead it{" "}
        <code className="icode">fetch()</code>es the{" "}
        <Link href="/api/users" className="link font-medium">
          /api/users
        </Link>{" "}
        Route Handler from the browser — note the manual loading state below.
      </p>

      <div className="mt-8">
        {error ? (
          <p className="rounded-lg border border-[var(--rose-300)] bg-[var(--rose-50)] p-4 text-sm text-rose-ink">
            {error}
          </p>
        ) : users === null ? (
          <ul className="space-y-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="card animate-pulse px-5 py-4">
                <div className="h-5 w-1/3 rounded bg-rule-2" />
                <div className="mt-2 h-4 w-1/2 rounded bg-rule" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <li key={user.id} className="card px-5 py-4">
                <p className="font-medium text-ink">{user.name}</p>
                <p className="text-sm text-ink-3">{user.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-8 text-sm text-ink-3">
        Compare with{" "}
        <Link href="/users-server" className="link font-medium">
          /users-server
        </Link>{" "}
        — same data, fetched on the server with no client JS.
      </p>
    </div>
  );
}
