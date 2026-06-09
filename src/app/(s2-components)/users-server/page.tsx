import Link from "next/link";
import { getUsers } from "@/lib/data";

export const metadata = {
  title: "Users (server)",
};

export default async function UsersServerPage() {
  const users = await getUsers();

  return (
    <div className="wrap py-12">
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        Users — Server Component
      </h1>
      <p className="mt-2 text-ink-2">
        This page is an <code className="icode">async function</code> that calls{" "}
        <code className="icode">getUsers()</code> from{" "}
        <code className="icode">src/lib/data.ts</code> directly. No{" "}
        <code className="icode">'use client'</code>, no{" "}
        <code className="icode">useEffect</code>, no loading state — the HTML
        arrives with the data already in it, and zero data-fetching JS ships to
        the browser.
      </p>
      <ul className="mt-8 space-y-3">
        {users.map((user) => (
          <li key={user.id} className="card px-5 py-4">
            <p className="font-medium text-ink">{user.name}</p>
            <p className="text-sm text-ink-3">{user.email}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-ink-3">
        Compare with{" "}
        <Link href="/users-client" className="link font-medium">
          /users-client
        </Link>{" "}
        — same data, fetched in the browser instead.
      </p>
    </div>
  );
}
