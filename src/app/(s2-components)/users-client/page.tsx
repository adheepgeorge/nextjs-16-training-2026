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
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">Users — Client Component</h1>
      <p className="mt-2 text-zinc-600">
        This page is marked{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          'use client'
        </code>
        , so it can&apos;t import the server-only fetchers in{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          data.ts
        </code>
        . Instead it{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          fetch()
        </code>
        es the{" "}
        <Link
          href="/api/users"
          className="font-medium text-zinc-900 underline underline-offset-2"
        >
          /api/users
        </Link>{" "}
        Route Handler from the browser — note the manual loading state below.
      </p>

      <div className="mt-8">
        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        ) : users === null ? (
          <ul className="space-y-3">
            {[1, 2, 3].map((n) => (
              <li
                key={n}
                className="animate-pulse rounded-lg border border-zinc-200 p-4"
              >
                <div className="h-5 w-1/3 rounded bg-zinc-200" />
                <div className="mt-2 h-4 w-1/2 rounded bg-zinc-100" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user.id}
                className="rounded-lg border border-zinc-200 p-4"
              >
                <p className="font-medium text-zinc-900">{user.name}</p>
                <p className="text-sm text-zinc-500">{user.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-8 text-sm text-zinc-500">
        Compare with{" "}
        <Link
          href="/users-server"
          className="font-medium text-zinc-900 underline underline-offset-2"
        >
          /users-server
        </Link>{" "}
        — same data, fetched on the server with no client JS.
      </p>
    </div>
  );
}
