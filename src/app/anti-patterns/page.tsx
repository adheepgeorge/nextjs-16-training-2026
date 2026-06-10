// ⚠️ DELIBERATELY BAD — this is the Session 4 "spot what's wrong" demo.
// The whole page tree is forced to the client for no good reason. Read the
// inline notes, then compare with /users-server (same data, done right).
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@/lib/data";

// Anti-pattern #1: the ENTIRE page is a Client Component. Nothing here is
// interactive — there are no events, no state the user changes — yet by putting
// 'use client' at the top we push this whole tree (and its children) into the
// browser bundle. Server Components should be the default; reach for the client
// only at interactive leaves (see /counter).
export default function AntiPatternsPage() {
  // Anti-pattern #2: re-implementing on the client what an async Server
  // Component does in one line. We need state + an effect + a manual loading
  // flag just to read data that never changes per user.
  const [users, setUsers] = useState<User[] | null>(null);

  // Anti-pattern #3: fetching in useEffect. This runs AFTER the page hydrates,
  // so users see a spinner on every visit. A request waterfall starts in the
  // browser instead of the data arriving in the initial HTML.
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data));
  }, []);

  return (
    <div className="wrap py-12">
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        Anti-patterns — how <em>not</em> to do it
      </h1>
      <p className="mt-2 text-ink-2">
        This page renders the same user list as{" "}
        <Link href="/users-server" className="link font-medium">
          /users-server
        </Link>{" "}
        — but the whole component is marked{" "}
        <code className="icode">'use client'</code> even though nothing on it is
        interactive. Before scrolling down:{" "}
        <strong>what&apos;s wrong here?</strong>
      </p>

      <div className="mt-8">
        {users === null ? (
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

      <section className="mt-12 rounded-xl border border-[var(--amber-300)] bg-[var(--amber-50)] p-6">
        <h2 className="text-lg font-semibold text-amber-ink">
          What&apos;s wrong here
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-2">
          <li>
            <strong>Whole tree is a Client Component.</strong> Nothing is
            interactive, so this should be a Server Component. The{" "}
            <code className="icode">'use client'</code> belongs at interactive
            leaves only.
          </li>
          <li>
            <strong>Client-side data fetching.</strong>{" "}
            <code className="icode">useEffect</code> +{" "}
            <code className="icode">fetch</code> runs after hydration, forcing a
            loading spinner and a browser waterfall.
          </li>
          <li>
            <strong>Extra round trip.</strong> The browser must hop to{" "}
            <code className="icode">/api/users</code> just to read data the
            server already had in <code className="icode">data.ts</code>.
          </li>
          <li>
            <strong>More JS shipped.</strong> The component, the fetching logic,
            and the data all travel to the browser instead of staying on the
            server.
          </li>
        </ul>
        <p className="mt-4 text-sm text-ink-2">
          The fix is{" "}
          <Link href="/users-server" className="link font-medium">
            /users-server
          </Link>
          : an <code className="icode">async</code> Server Component that{" "}
          <code className="icode">await</code>s the data inline — no{" "}
          <code className="icode">'use client'</code>, no effect, no spinner, no
          extra request.
        </p>
      </section>
    </div>
  );
}
