import Link from "next/link";
import { getUsers } from "@/lib/data";

export const metadata = {
  title: "Users (server)",
};

export default async function UsersServerPage() {
  const users = await getUsers();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">Users — Server Component</h1>
      <p className="mt-2 text-zinc-600">
        This page is an{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          async function
        </code>{" "}
        that calls{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          getUsers()
        </code>{" "}
        from{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          src/lib/data.ts
        </code>{" "}
        directly. No <code className="font-mono text-sm">'use client'</code>, no{" "}
        <code className="font-mono text-sm">useEffect</code>, no loading state —
        the HTML arrives with the data already in it, and zero data-fetching JS
        ships to the browser.
      </p>
      <ul className="mt-8 space-y-3">
        {users.map((user) => (
          <li key={user.id} className="rounded-lg border border-zinc-200 p-4">
            <p className="font-medium text-zinc-900">{user.name}</p>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-zinc-500">
        Compare with{" "}
        <Link
          href="/users-client"
          className="font-medium text-zinc-900 underline underline-offset-2"
        >
          /users-client
        </Link>{" "}
        — same data, fetched in the browser instead.
      </p>
    </div>
  );
}
