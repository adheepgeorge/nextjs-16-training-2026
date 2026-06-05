# Next.js 16 Freshers Training — Build Plan

> Project: `nextjs-training-2026-demo`
> Stack: **Next.js 16.2.4 · React 19.2.4** · TypeScript · Tailwind CSS v4 · App Router · Turbopack (default)
> Audience: Freshers — 4 sessions, ~2.5 hours total
> Caching model: **Cache Components OFF** (v16 default) — caching is intentionally a day-2 topic, not taught here
> **Prerequisite:** solid **React fundamentals** (components, props, `useState`/`useEffect`) + **ES6 JS**
> (arrow fns, `async`/`await`, destructuring, modules). Anyone shaky on these should do
> [React Foundations](https://react.dev/learn) first — Session 2 assumes `useState`/`useEffect` are second nature.

---

## 0. Context

This repo is the **live-demo companion** to four training session markdowns in
`.cursor/nextjs-freshers-training-2026-docs/`. Each demo route maps to a teaching point.

Demos are **pre-built and instructor-led** — freshers watch, they don't type. All demos live
on `main` in finished form; the instructor navigates the live app and walks through the code.

### The four sessions

| # | Session | Min | Time | Core concepts |
|---|---------|-----|------|---------------|
| 1 | **Intro & Routing** | 45 | 9:30–10:15 | Why Next.js, file-system routing, dynamic segments, layouts, `<Link>`, special files |
| 2 | **Components & Data Fetching** | 45 | 10:30–11:15 | Server vs Client Components, the `'use client'` boundary, async server components, `<Suspense>` streaming |
| 3 | **Server Actions & Mutations** | 30 | 11:15–11:45 | Forms → `'use server'` → mutate → `revalidatePath`. Completes the read (S2) / write (S3) cycle |
| 4 | **Best Practices, Real-World & Disadvantages** | 30 | 11:45–12:15 | Discussion-led: real-world use cases, performance wins, pitfalls, when *not* to use Next.js. Caching covered as a ~3-min concept only |

**Teaching arc:** routing → render & read → write → ship well. This mirrors the official
[Next.js Learn](https://nextjs.org/learn/dashboard-app) progression.

> **Why no caching deep-dive?** Caching is the single hardest part of Next.js even for seniors
> (`cacheLife`/`cacheTag`, `updateTag` vs `revalidateTag`, PPR shells). It isn't load-bearing for
> day one — routing + components + data fetching + mutations is already a complete, useful
> curriculum. Keeping **Cache Components off** (the v16 default) means async components and data
> fetching "just work" without freshers ever confronting the *"Uncached data was accessed outside
> `<Suspense>`"* build error. Caching is signposted as a **Phase 2 / day-2 topic**.

---

## 1. What's specifically Next.js 16 (and must be taught correctly)

These are **breaking changes from v15** — old habits and most training data are wrong here.
Per `AGENTS.md`, consult `node_modules/next/dist/docs/` before writing any Next.js code.

| Area | v16 reality | Where it surfaces |
|---|---|---|
| **`params` / `searchParams`** | Are **Promises** — must be `await`ed | S1 (`[slug]`), S2 |
| **`cookies()` / `headers()` / `draftMode()`** | **async only** — sync versions removed | S2, S3 |
| **Turbopack** | **Default** for `dev` and `build` — no `--turbopack` flag | S1 (one-liner) |
| **Cache Components** | **Left off** (v16 default). Mentioned by name in S4 as a day-2 topic; not used in any demo | S4 (concept only) |
| **`revalidatePath` / `revalidateTag`** | The simple, model-agnostic way to refresh data after a mutation — works with Cache Components off | S3 |

> **The one rendering idea freshers need:** components render on the **server by default**;
> reach for `'use client'` only when you need interactivity, and keep it at the leaves. With
> Cache Components off there's no build-time caching error to trip over — a route that reads
> runtime data simply renders per request. The deeper static/dynamic-per-component model (PPR,
> `'use cache'`) is explicitly a **Phase 2** topic.

---

## 2. The mental model freshers should leave with

```
Fetching data?      →  async Server Component (await the data right in the component)
Need interactivity? →  'use client' (keep it small, at the leaves)
Slow data?          →  wrap it in <Suspense> so the rest of the page streams in
Mutating data?      →  'use server' action, then revalidatePath('/route')
```

That's a complete loop: render on the server, fetch data inline, stream the slow parts,
mutate via actions, refresh with `revalidatePath`. Caching and PPR are deliberately left for
a follow-up — the defaults are good enough for everything in this course.

---

## 3. Setup checklist

### Step 1 — Verify scaffold
- [ ] `npm run dev` → confirm http://localhost:3000 loads → kill server

### Step 2 — Confirm config (Cache Components stays OFF)
- [ ] Leave `next.config.ts` as the default scaffold (no `cacheComponents` flag)
- [ ] Confirm `npm run build` succeeds on the clean scaffold

### Step 3 — Clean boilerplate
- [ ] Replace `src/app/page.tsx` with a **nav hub** (cards linking to each session's demos)
- [ ] Tidy `src/app/layout.tsx` metadata; simplify font setup if needed
- [ ] Remove unused assets from `public/`

### Step 4 — Route structure (route groups, URL-invisible)
- [ ] `src/app/(s1-routing)/` — Session 1 demos
- [ ] `src/app/(s2-components)/` — Session 2 demos
- [ ] `src/app/(s3-actions)/` — Session 3 demos
- [ ] Session 4 is discussion-led — no route group needed (optional `/anti-patterns` demo only)
- [ ] `src/lib/data.ts` — shared mock fetchers (users, posts, products) with small artificial delays so streaming is visible

### Step 5 — Companion docs
- [ ] Update `README.md` — how to run, **prerequisites (React + ES6)**, branch map, demo list
- [ ] Add `INSTRUCTOR.md` — per-route demo flow + talking points (not a "what to type" script)
- [ ] Add `CHEATSHEET.md` — one-page takeaway handed out at the end (decision tree + v16 gotchas + "what you can now build")

### Step 6 — Git checkpoints (named snapshots, not dev branches; all work on `main`)
- [ ] `git branch session-1-start` — clean scaffold (default config)
- [ ] build S1 → commit → `git branch session-2-start`
- [ ] build S2 → commit → `git branch session-3-start`
- [ ] build S3 → commit → `git branch session-4-start`
- [ ] build S4 (`/anti-patterns` demo) → commit (`main` is now 1 commit ahead of `session-4-start`)

---

## 4. Demos to build

### Session 1 — Intro & Routing  `(s1-routing)`
| Route | Concept | Status |
|---|---|---|
| `/` (home) | Nav hub, cards with `<Link>` | ☐ |
| `/about` | Plain page, no data | ☐ |
| `/blog` | Static list of posts | ☐ |
| `/blog/[slug]` | Dynamic segment + **`await params`** (Promise in v16) + **`generateMetadata`** (per-page `<title>`/SEO) | ☐ |
| `/layout-demo` | Nested layout (section header/sidebar) | ☐ |
| `/layout-demo/settings` | Child route inheriting the layout | ☐ |

Highlight: file→URL mapping, `[slug]`/`[...catchAll]`, special files (`layout`/`page`/`loading`/`error`/`not-found`), `<Link>` prefetch + client nav, Turbopack-by-default one-liner. On `/blog/[slug]`, show **`generateMetadata`** generating the page `<title>` from the slug — this is half the answer to "why Next.js" (SEO), and it's beginner-friendly: a 2-minute async export, no new mental model.

### Session 2 — Components & Data Fetching  `(s2-components)`

This is the hardest conceptual session — **kept to 4 core demos** so each one can breathe (~10 min
each). Two extras are "if time permits" only; don't rush them in.

**Core (build + teach):**
| Route | Concept | Status |
|---|---|---|
| `/users-server` | **Async Server Component** fetching users directly (no JS shipped, no loading state) | ☐ |
| `/users-client` | Client Component fetching the **same data via a Route Handler** — contrast: `'use client'`, `useEffect`, manual loading state, data in the JS bundle | ☐ |
| `/counter` | The `'use client'` boundary — state + events at a leaf | ☐ |
| `/dashboard` | Streaming via `loading.tsx` — slow page shows a skeleton instantly | ☐ |

> **Build note for `/users-client`:** a Client Component **cannot** import the server fetchers in
> `src/lib/data.ts` (they're server-only). It must `fetch()` an HTTP endpoint. So this demo also
> requires a **Route Handler** at `src/app/api/users/route.ts` that returns the same mock users as
> JSON. That's a feature, not a chore — Route Handlers are a legit beginner topic, and having the
> server component read `data.ts` *directly* while the client component must hop through `/api/users`
> is itself the clearest illustration of the server/client divide.

**If time permits (build, but cut from the live walkthrough under time pressure):**
| Route | Concept | Status |
|---|---|---|
| `/dashboard/granular` | Granular streaming with explicit `<Suspense>` boundaries | ☐ |
| `/parallel-fetch` | `Promise.all` to avoid request waterfalls | ☐ |

Highlight: server-first default, push `'use client'` to the leaves, async components are just
`async function`, `<Suspense>` makes slow content stream while the rest of the page renders.

### Session 3 — Server Actions & Mutations  `(s3-actions)`
| Route | Concept | Status |
|---|---|---|
| `/guestbook` | `<form action={serverAction}>` → append entry → `revalidatePath` → list updates | ☐ |
| `/todos` | Add / toggle todos via Server Actions; `useActionState` for pending + error UI | ☐ |

Highlight: `'use server'`, progressive-enhancement forms (work without JS), server-side
validation, and **closing the loop** — after a mutation call `revalidatePath('/todos')` so the
server-rendered list reflects the change. Simple and model-agnostic; no caching APIs needed.

> **End Session 3 with the "you can now build a real app" recap.** Explicitly tie the three
> sessions into one loop so they land as a complete skill, not disconnected routes:
> *route* (S1) → *render & fetch data* (S2) → *mutate & refresh* (S3). State plainly: "with just
> this, you can build a working CRUD feature." This is the emotional payoff of the course.

### Session 4 — Best Practices, Real-World & Disadvantages  (discussion-led)
No new feature demos. **Keep it active, not a lecture** — freshers fade fast on 30 min of slides.
Structure it around two interactive beats plus a takeaway:

- **"Spot what's wrong" on `/anti-patterns`** (build this one demo). Open the deliberately-bad
  page — entire tree marked `'use client'` — and ask the room what's off *before* revealing.
  Then flip to `/users-server` side by side. This anchors the whole best-practices discussion in
  something concrete they diagnose themselves.
- **Real-world use cases** — who uses Next.js and for what (e-commerce, dashboards, content); keep
  it to 2–3 quick examples, not a roll-call.
- **Best practices** — server-first, small client boundaries, colocate data fetching, `<Suspense>`
  for slow data. Frame each as "you already saw this in demo X."
- **Caching — the ~3-min concept** ⚠️ *only the idea, no API drilling.* "Next.js can cache parts
  of your page and even pre-render them at build time. v16 has a powerful model for this called
  **Cache Components** (`'use cache'`, PPR) — it's the single trickiest part of the framework, so
  it's a **day-2 topic**. For everything today, the defaults are fine."
- **When *not* to use Next.js** — present as a quick **decision flowchart** (simple static site? →
  plain HTML / Astro; SPA-only internal tool, no SEO? → Vite + React; no Node/serverless host? →
  reconsider), not a prose lecture.
- **Hand out the takeaway cheatsheet** (see below) as the closing artifact.

Single demo to build:
| Route | Concept | Status |
|---|---|---|
| `/anti-patterns` | Deliberately bad: entire page tree marked `'use client'` — contrast with `/users-server` | ☐ |

### Takeaway cheatsheet (one page, handed out at the end)
Build this as a short markdown/printable so freshers leave with the model, not just memories:
- The §2 decision tree (fetch → server component, interactivity → `'use client'`, slow → `<Suspense>`, mutate → action + `revalidatePath`)
- The §1 v16 gotchas (`await params`/`cookies`, Turbopack default, caching = day-2)
- "What you can now build": the S1→S2→S3 loop = a working CRUD feature
- Links: [Next.js Learn](https://nextjs.org/learn), [react.dev](https://react.dev/learn), this repo's branches

---

## 5. Locked decisions

1. **Cache Components: OFF** (v16 default — no `cacheComponents` flag). Caching is **not** a
   hands-on topic. It gets a ~3-minute conceptual mention in S4 and is signposted as Phase 2.
   Do **not** build demos around `'use cache'` / `cacheLife` / `cacheTag` / `updateTag` / PPR.
   For mutations in S3, use `revalidatePath` / `revalidateTag` (work with the flag off).
2. **Demo style: pre-built, instructor-led.** No fresher hands-on. `INSTRUCTOR.md` is a
   talking-points guide, not a typing script. No `EXERCISES.md`.
3. **Branch strategy:** four `session-N-start` branches are named snapshots; all dev on `main`.
   `session-4-start` = state after S3; `main` ends one commit ahead (the S4 `/anti-patterns` demo).

---

## 6. Out of scope (point to a "Phase 2" follow-up)

**Caching & rendering control** (Cache Components, `'use cache'`, `cacheLife`/`cacheTag`,
`updateTag`, PPR) · parallel routes (`@slot`) · intercepting routes (`(.)folder`) ·
middleware/proxy · auth · edge runtime · external state libs (Redux/Zustand) ·
MDX/advanced metadata · multi-zone/multi-tenant.

> Caching is the natural headline of a **Phase 2** follow-up — it's the most valuable next
> topic once freshers are comfortable with the basics here.

---

## 7. Build order

1. `git branch session-1-start` (snapshot clean scaffold)
2. Confirm default config (Cache Components off); build is green
3. Replace `page.tsx` with nav hub; create `(s1-routing)`/`(s2-components)`/`(s3-actions)`
4. Create `src/lib/data.ts` (mock fetchers + artificial delays)
5. Build S1 (incl. `generateMetadata` on `/blog/[slug]`) → commit → `git branch session-2-start`
6. Build S2 — 4 core demos + the `/api/users` Route Handler that `/users-client` fetches, plus the
   two "if time permits" demos → commit → `git branch session-3-start`
7. Build S3 → commit → `git branch session-4-start`
8. Build the `/anti-patterns` demo for S4 → commit
9. Write `INSTRUCTOR.md` from what was built (S4 = talking points, not code)
10. Write `CHEATSHEET.md` (one-page takeaway) and update `README.md` (run steps, **prerequisites**,
    branch map, demo list)
11. Final QA: `npm run build` green, every route loads, `/users-client` successfully hits
    `/api/users`, streaming is visibly demonstrable on `/dashboard`, `INSTRUCTOR.md` walkthrough
    runs end-to-end

---

## 8. Files touched / created

```
nextjs-training-2026-demo/
├── next.config.ts                      (unchanged — Cache Components stays off)
├── README.md                           (update: + prerequisites)
├── INSTRUCTOR.md                       (new)
├── CHEATSHEET.md                       (new: one-page takeaway handout)
├── .cursor/
│   ├── plan.md                         ← this file
│   └── nextjs-freshers-training-2026-docs/
│       ├── 01-intro-to-nextjs.md       (align: routing, await params, generateMetadata)
│       ├── 02-...                       (rewrite: components + data fetching + Route Handler)
│       ├── 03-...                       (rewrite: server actions + revalidatePath)
│       └── 04-...                       (rewrite: best practices / real-world / caching-as-concept)
└── src/
    ├── app/
    │   ├── page.tsx                     (replace: nav hub)
    │   ├── layout.tsx                   (tweak metadata)
    │   ├── api/users/route.ts           (new: Route Handler — JSON source for /users-client)
    │   ├── (s1-routing)/    about · blog · blog/[slug] (+generateMetadata) · layout-demo · layout-demo/settings
    │   ├── (s2-components)/ users-server · users-client · counter · dashboard   [+ if-time: dashboard/granular · parallel-fetch]
    │   ├── (s3-actions)/    guestbook · todos
    │   └── anti-patterns/   (S4 demo)
    └── lib/
        └── data.ts                      (new)
```

---

## 9. References

- Local v16 docs: `node_modules/next/dist/docs/` (required reading per `AGENTS.md`)
- Curated docs: `~/.agents/llm-docs/` (use `/docs nextjs 16 <query>`)
- Key v16 doc pages: `getting-started/server-and-client-components`,
  `getting-started/fetching-data`, `getting-started/updating-data` (server actions),
  `guides/upgrading/version-16` (async `params`/`cookies`, Turbopack default)
- Official tutorial (progression reference): https://nextjs.org/learn/dashboard-app
