# Next.js 16 — Freshers Training (2026)

A live-demo companion for a 4-session Next.js 16 course. Each route maps to a
teaching point; instructors walk the running app and the code. Built on
**Next.js 16.2.7 · React 19.2.4 · TypeScript · Tailwind CSS v4 · Biome · pnpm**,
with **Turbopack** as the default bundler and **Cache Components off** (the v16
default — caching is a day-2 topic).

---

## Prerequisites

- **React fundamentals** — components, props, `useState` / `useEffect`. Session 2
  assumes these are second nature. Shaky? Do [React Foundations](https://react.dev/learn) first.
- **ES6 JavaScript** — arrow functions, `async`/`await`, destructuring, modules.
- **Node.js** + **pnpm** installed.

---

## Getting started

```bash
pnpm install
pnpm dev      # Turbopack by default — no --turbopack flag in v16
```

Open [http://localhost:3000](http://localhost:3000) — the home page is a **nav hub**
linking to every demo, grouped by session.

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm lint` | Biome check (not ESLint) |
| `pnpm format` | Biome format `--write` |

---

## The four sessions

| # | Session | Min | Script | Demos |
|---|---------|-----|--------|-------|
| 1 | Intro & Routing | 45 | [script](teaching-scripts/session-1-routing.md) | `/about` · `/blog` · `/blog/[slug]` · `/layout-demo` |
| 2 | Components & Data Fetching | 45 | [script](teaching-scripts/session-2-components.md) | `/users-server` · `/users-client` · `/counter` · `/dashboard` |
| 3 | Server Actions & Mutations | 30 | [script](teaching-scripts/session-3-actions.md) | `/guestbook` · `/todos` |
| 4 | Best Practices & Disadvantages | 30 | [script](teaching-scripts/session-4-best-practices.md) | `/anti-patterns` |

**Teaching arc:** route → read → write → judge it. See [`INSTRUCTOR.md`](INSTRUCTOR.md)
for timing, talking points, and how to drive the demo, and [`CHEATSHEET.md`](CHEATSHEET.md)
for the one-page takeaway.

---

## Branch model

Per-session branches, **chained** — each cut from the previous session's tip,
carrying all prior sessions plus its own code **and** its own teaching script.
`main` is the full course.

| Branch | Contents |
|---|---|
| `session-0-scaffold` | Clean scaffold + docs + agent rules |
| `session-1-routing` | + routing demos |
| `session-2-components` | + components & data fetching |
| `session-3-actions` | + server actions |
| `session-4-antipatterns` | + anti-patterns demo |
| `main` | Full course + `INSTRUCTOR.md` / `CHEATSHEET.md` / this README |

- **Watch the finished demo:** `git switch main` (default).
- **Build along:** `git switch <previous-session-branch>` — you get prior sessions
  only; build today's routes yourself, then diff against this session's branch.

---

## v16 gotchas (breaking changes from v15)

- **`params` / `searchParams` are Promises** — `await` them in pages and `generateMetadata`.
- **`cookies()` / `headers()` / `draftMode()` are async-only** — no sync versions.
- **Turbopack is the default** for `dev` and `build` — no `--turbopack` flag.
- **Cache Components stays OFF** — async data fetching "just works"; caching is a day-2 topic.

---

## Project layout

```
src/
├── app/
│   ├── page.tsx              nav hub
│   ├── (s1-routing)/         about · blog · blog/[slug] · layout-demo
│   ├── (s2-components)/      users-server · users-client · counter · dashboard · parallel-fetch
│   ├── (s3-actions)/         guestbook · todos
│   ├── anti-patterns/        S4 demo
│   └── api/users/route.ts    JSON source for /users-client
└── lib/
    └── data.ts               mock fetchers + artificial delays
```

Learn more: [Next.js Docs](https://nextjs.org/docs) · [Next.js Learn](https://nextjs.org/learn) · [react.dev](https://react.dev/learn).
