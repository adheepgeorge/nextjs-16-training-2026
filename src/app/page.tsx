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

const session3Demos = [
  {
    href: "/guestbook",
    title: "Guestbook",
    description:
      "<form action={serverAction}> → append → revalidatePath. The simplest write.",
  },
  {
    href: "/todos",
    title: "Todos",
    description:
      "Add via useActionState (pending + error UI); toggle via form actions.",
  },
];

type Demo = { href: string; title: string; description: string };

function DemoGrid({ demos }: { demos: Demo[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {demos.map((demo) => (
        <Link key={demo.href} href={demo.href} className="card-link px-5 py-4">
          <span className="block font-medium text-ink">{demo.title}</span>
          <p className="mt-1 text-sm leading-snug text-ink-3">
            {demo.description}
          </p>
          <span className="mono mt-3 block text-xs text-blue-ink">
            {demo.href}
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="wrap">
      <header className="hero">
        <p className="eyebrow">
          Next.js 16 Training
          <span className="pkg">next@16.2.7</span>
        </p>
        <h1 className="hero-title">Demo nav hub</h1>
        <p className="hero-lead">
          A live-demo companion for the freshers training. Routes are grouped by
          session with <strong>route groups</strong>, which organize files
          without changing the URL.
        </p>
        <div className="hero-meta">
          <span className="chip">
            <span className="sq blue" />
            Routing
          </span>
          <span className="chip">
            <span className="sq green" />
            Components &amp; data
          </span>
          <span className="chip">
            <span className="sq amber" />
            Server actions
          </span>
          <span className="chip">
            <span className="sq violet" />
            Best practices
          </span>
        </div>
      </header>

      <section className="pt-12">
        <span className="sec-num">01 — Routing</span>
        <h2 className="sec-title">Session 1</h2>
        <p className="mt-3 mb-6 max-w-xl text-sm text-ink-3">
          Routes live under <code className="icode">src/app/(s1-routing)/</code>
          .
        </p>
        <DemoGrid demos={session1Demos} />
      </section>

      <section className="pt-14">
        <span className="sec-num">02 — Components &amp; data fetching</span>
        <h2 className="sec-title">Session 2</h2>
        <p className="mt-3 mb-6 max-w-xl text-sm text-ink-3">
          Routes live under{" "}
          <code className="icode">src/app/(s2-components)/</code>, plus the{" "}
          <code className="icode">/api/users</code> Route Handler.
        </p>
        <DemoGrid demos={session2Demos} />
      </section>

      <section className="pt-14">
        <span className="sec-num">03 — Server actions &amp; mutations</span>
        <h2 className="sec-title">Session 3</h2>
        <p className="mt-3 mb-6 max-w-xl text-sm text-ink-3">
          Routes live under <code className="icode">src/app/(s3-actions)/</code>
          . Forms call <code className="icode">'use server'</code> actions, then{" "}
          <code className="icode">revalidatePath</code> refreshes the list.
        </p>
        <DemoGrid demos={session3Demos} />
      </section>
    </div>
  );
}
