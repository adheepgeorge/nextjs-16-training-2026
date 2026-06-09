import Link from "next/link";

const session1Demos = [
  {
    href: "/about",
    title: "About",
    description: "Plain static page — file maps to URL, no data fetching.",
  },
  {
    href: "/blog",
    title: "Blog",
    description:
      "Post list with loading.tsx — watch the skeleton while data loads.",
  },
  {
    href: "/blog/welcome-to-nextjs-16",
    title: "Blog post (dynamic)",
    description: "await params + generateMetadata on /blog/[slug].",
  },
  {
    href: "/layout-demo",
    title: "Layout demo",
    description: "Nested layout with a persistent sidebar across child routes.",
  },
  {
    href: "/layout-demo/settings",
    title: "Layout demo → Settings",
    description: "Child route inherits the parent layout automatically.",
  },
];

const session2Demos = [
  {
    href: "/users-server",
    title: "Users (server)",
    description:
      "Async Server Component fetching data directly — no client JS.",
  },
  {
    href: "/users-client",
    title: "Users (client)",
    description:
      "'use client' + useEffect fetching the same data via /api/users.",
  },
  {
    href: "/counter",
    title: "Counter",
    description: "The 'use client' boundary — state + events kept at a leaf.",
  },
  {
    href: "/dashboard",
    title: "Dashboard (streaming)",
    description: "Slow page streams in behind an instant loading.tsx skeleton.",
  },
  {
    href: "/dashboard/granular",
    title: "Dashboard → granular",
    description:
      "Explicit <Suspense> boundaries stream each section on its own.",
  },
  {
    href: "/parallel-fetch",
    title: "Parallel fetch",
    description:
      "Promise.all runs independent fetches together — no waterfall.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <p className="text-sm font-medium text-zinc-500">Next.js 16 Training</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Demo nav hub
        </h1>
        <p className="mt-3 text-zinc-600">
          Session 1 routes live under{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
            src/app/(s1-routing)/
          </code>
          . Route groups organize files without changing the URL.
        </p>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-medium">Session 1 — Routing</h2>
        <ul className="grid gap-4">
          {session1Demos.map((demo) => (
            <li key={demo.href}>
              <Link
                href={demo.href}
                className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
              >
                <span className="font-medium text-zinc-900">{demo.title}</span>
                <p className="mt-1 text-sm text-zinc-600">{demo.description}</p>
                <p className="mt-2 font-mono text-xs text-zinc-400">
                  {demo.href}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-1 text-lg font-medium">
          Session 2 — Components & Data Fetching
        </h2>
        <p className="mb-4 text-sm text-zinc-500">
          Routes live under{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
            src/app/(s2-components)/
          </code>
          , plus the{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
            /api/users
          </code>{" "}
          Route Handler.
        </p>
        <ul className="grid gap-4">
          {session2Demos.map((demo) => (
            <li key={demo.href}>
              <Link
                href={demo.href}
                className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
              >
                <span className="font-medium text-zinc-900">{demo.title}</span>
                <p className="mt-1 text-sm text-zinc-600">{demo.description}</p>
                <p className="mt-2 font-mono text-xs text-zinc-400">
                  {demo.href}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
