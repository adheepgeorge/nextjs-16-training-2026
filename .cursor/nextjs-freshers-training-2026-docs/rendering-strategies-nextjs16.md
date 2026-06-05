# Rendering Strategies in Next.js 16

> Based on Next.js 16.2.4 official docs.
> Source: https://nextjs.org/docs/app/guides/rendering-philosophy

<style>
/* Keep syntax highlighting while making JSX/HTML tags readable */
pre code .hljs-tag,
pre code .hljs-name,
pre code .hljs-selector-tag,
pre code .token.tag,
pre code .token.tag .token.punctuation,
pre code .token.attr-name,
pre code .token.namespace {
  color: #6d28d9 !important;
  background: transparent !important;
  font-weight: 600;
}

pre code .hljs-tag *,
pre code .token.tag * {
  color: inherit !important;
  background: transparent !important;
}
</style>

---

## The Old Mental Model (SSG / ISR / SSR / CSR)

In older Next.js (Pages Router era) and early App Router docs, developers thought in four distinct modes:

| Mode | When rendered | How specified |
|---|---|---|
| **SSG** | Build time | `getStaticProps` (Pages) / no dynamic usage (App) |
| **ISR** | Build time + background refresh | `getStaticProps` + `revalidate` (Pages) / `export const revalidate` (App) |
| **SSR** | Per request | `getServerSideProps` (Pages) / using `cookies()`, `headers()` etc. (App) |
| **CSR** | In the browser | `useEffect` / client-only fetch |

These were **route-level** decisions. An entire page was either static or dynamic.

---

## The New Mental Model in Next.js 16

Next.js 16 fundamentally changes this. The key insight from the official docs:

> **"The boundary between static and dynamic is at the component level, not the route level."**

A single page can simultaneously have:
- A **static shell** (prerendered at build time, served from CDN instantly)
- **Cached sections** (fetched once, shared across users, revalidated on a schedule)
- **Dynamic sections** (rendered per request, streamed in after the static shell arrives)

This approach is called **Partial Prerendering (PPR)** and it is the default behavior when Cache Components are enabled.

---

## Two Modes in Next.js 16

Next.js 16 supports two models side by side. Which one applies depends on your `next.config.ts`.

### Mode 1: Previous Model (default, no config change needed)

The old static/dynamic detection logic, using route segment configs and fetch options.

### Mode 2: Cache Components Model (opt-in)

```ts
// next.config.ts
const nextConfig: NextConfig = {
  cacheComponents: true,
}
```

With this enabled, PPR is the default and `use cache` replaces old caching APIs.

The rest of this document covers **both models**.

---

## How Next.js Decides Automatically

### Previous Model — automatic detection

Next.js scans each route at build time. If it detects any of the following, the route becomes **dynamic** (rendered per request):

| Trigger | What it does |
|---|---|
| `cookies()` | Reads request cookies |
| `headers()` | Reads request headers |
| `searchParams` prop | Reads URL query params |
| `fetch(..., { cache: 'no-store' })` | Explicit uncached fetch |
| `export const revalidate = 0` | Forces no caching |
| `connection()` | Explicitly defers to request time |

If none of these are present, Next.js **statically prebuilds** the route.

### Cache Components Model — automatic detection (PPR)

At build time, Next.js renders your component tree and classifies every component:

| Component behaviour | Result |
|---|---|
| Pure computation, sync I/O, module imports | Included in static HTML shell automatically |
| Marked with `'use cache'` | Rendered once, result cached, included in static shell |
| Wrapped in `<Suspense>` without `use cache` | Fallback included in static shell; content streams at request time |
| Accesses runtime APIs (`cookies()`, `headers()`, `connection()`, non-deterministic ops) outside `<Suspense>` | Build error — must wrap in `<Suspense>` or `use cache` |

> Next.js will throw an `Uncached data was accessed outside of <Suspense>` error at build time if dynamic content is not properly wrapped. This makes the rendering boundary explicit and enforced.

---

## How Developers Specify Rendering Behaviour

### Cache Components Model — `use cache` directive

`use cache` is the primary way to cache data or entire components. It replaces ISR and SSG patterns.

**Cache a data-fetching function:**

```ts
// app/lib/data.ts
import { cacheLife } from 'next/cache'

export async function getPosts() {
  'use cache'
  cacheLife('hours') // revalidate every hour
  return db.query('SELECT * FROM posts')
}
```

**Cache an entire component (replaces SSG at component level):**

```tsx
// app/blog/page.tsx
import { cacheLife } from 'next/cache'

async function BlogPosts() {
  'use cache'
  cacheLife('days')
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
```

**`cacheLife` built-in profiles:**

| Profile | Revalidates every | Expires after |
|---|---|---|
| `seconds` | 1s | 60s |
| `minutes` | 1m | 1h |
| `hours` | 1h | 1d |
| `days` | 1d | 1w |
| `weeks` | 1w | 30d |
| `max` | 30d | ~forever |

> A cache with `revalidate: 0` or `expire < 5 minutes` is treated as **short-lived** and becomes a dynamic hole — it is not included in the static shell.

---

### Cache Components Model — `<Suspense>` for dynamic content

Anything that must run at request time (personalized, real-time) should be wrapped in `<Suspense>`. The fallback is included in the static shell; the actual content streams in.

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <>
      {/* Static — prerendered, served instantly */}
      <h1>Dashboard</h1>

      {/* Dynamic — streams in at request time */}
      <Suspense fallback={<p>Loading your data...</p>}>
        <PersonalizedContent />
      </Suspense>
    </>
  )
}

async function PersonalizedContent() {
  const theme = (await cookies()).get('theme')?.value
  return <p>Your theme: {theme}</p>
}
```

---

### Cache Components Model — Force dynamic with `connection()`

If a component must always run at request time (e.g. it generates a unique ID per request), call `connection()`:

```ts
import { connection } from 'next/server'

async function UniqueContent() {
  await connection() // signals: this runs at request time
  const uuid = crypto.randomUUID()
  return <p>Request ID: {uuid}</p>
}
```

---

### Previous Model — Route Segment Config

When **not** using `cacheComponents`, developers use exported constants to override the auto-detected rendering mode.

**`dynamic`** — force an entire route static or dynamic:

```ts
// page.tsx | layout.tsx | route.ts
export const dynamic = 'auto'         // default: auto-detect
export const dynamic = 'force-dynamic' // always SSR (per request)
export const dynamic = 'force-static'  // always static (cookies/headers return empty)
export const dynamic = 'error'         // static only — throw if dynamic APIs used
```

**`revalidate`** — set ISR refresh interval:

```ts
export const revalidate = false  // default: cache forever
export const revalidate = 0      // never cache (equivalent to SSR)
export const revalidate = 60     // ISR: revalidate every 60 seconds
```

**Fetch-level cache control:**

```ts
// Force cache (SSG-like for this fetch)
const data = await fetch('https://...', { cache: 'force-cache' })

// No cache (SSR-like for this fetch)
const data = await fetch('https://...', { cache: 'no-store' })

// ISR-like for this fetch
const data = await fetch('https://...', { next: { revalidate: 3600 } })
```

---

## Side-by-Side Comparison

| Old concept | Previous Model equivalent | Cache Components equivalent |
|---|---|---|
| **SSG** (build once) | No dynamic APIs used in route | Component with no `<Suspense>`, no `use cache` (pure static) |
| **ISR** (refresh on schedule) | `export const revalidate = N` | `'use cache'` + `cacheLife('hours')` |
| **ISR** (refresh on demand) | `revalidateTag()` / `revalidatePath()` | `cacheTag('name')` + `revalidateTag('name')` |
| **SSR** (per request) | `export const dynamic = 'force-dynamic'` | Wrap in `<Suspense>` (streams at request time) |
| **CSR** (browser only) | `'use client'` + `useEffect` fetch | `'use client'` + `useEffect` fetch (unchanged) |

---

## A Complete Example (Cache Components Model)

```tsx
// app/blog/page.tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag, updateTag } from 'next/cache'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <>
      {/* 1. Static — prerendered automatically, no directive needed */}
      <header>
        <h1>Our Blog</h1>
        <nav>
          <Link href="/">Home</Link> | <Link href="/about">About</Link>
        </nav>
      </header>

      {/* 2. Cached — shared across users, included in static shell */}
      <BlogPosts />

      {/* 3. Dynamic — personalized, streams at request time */}
      <Suspense fallback={<p>Loading preferences...</p>}>
        <UserPreferences />
      </Suspense>
    </>
  )
}

// ISR equivalent — revalidate every hour, or on-demand via tag
async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  cacheTag('posts')

  const posts = await fetch('https://api.example.com/blog').then(r => r.json())
  return (
    <ul>
      {posts.map((post: any) => <li key={post.id}>{post.title}</li>)}
    </ul>
  )
}

// SSR equivalent — reads cookies so must run per request
async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value || 'light'
  return <p>Your theme: {theme}</p>
}
```

**What happens at build time:**
1. `<header>` — pure static JSX → goes straight into the HTML shell
2. `BlogPosts` — `use cache` → rendered once, result cached, added to HTML shell
3. `<UserPreferences>` fallback (`Loading preferences...`) → added to HTML shell
4. `<UserPreferences>` actual content → deferred, streams at request time

**What the user sees:**
- The header and blog posts appear instantly (from CDN/cache)
- `"Loading preferences..."` appears instantly
- Preferences stream in shortly after, replacing the fallback

---

## Key Takeaways

1. **Next.js 16 is automatic first.** It detects static vs dynamic at the component level — you don't have to declare it for most cases.
2. **The unit of caching is now a function or component, not a route.** A single page can mix static, cached, and live content.
3. **`use cache` replaces SSG + ISR.** It caches any async function or component with fine-grained lifetime control via `cacheLife`.
4. **`<Suspense>` is the dynamic boundary.** Anything that must run at request time goes inside `<Suspense>`. The fallback becomes part of the static shell.
5. **The old route segment configs (`dynamic`, `revalidate`) still work** in the previous model (without `cacheComponents: true`), and are deprecated but not removed when using Cache Components.
6. **CSR (`'use client'`) is unchanged.** Client Components work the same in both models — use them when you need `useState`, `useEffect`, or browser APIs.

---

## Evolution Across Three Eras: Pages Router → Next.js 15 → Next.js 16

> Sources: [Next.js 15 blog](https://nextjs.org/blog/next-15), [Next.js 16 blog](https://nextjs.org/blog/next-16), [Our Journey with Caching](https://nextjs.org/blog/our-journey-with-caching), official docs.

---

### Era 1 — Pages Router (Next.js 12–13)

The rendering strategy is **fully explicit, per page**, determined by which data-fetching function you export from a `pages/` file. There is no ambiguity — Next.js does not infer anything.

#### SSG — `getStaticProps`

```jsx
// pages/blog.js
export async function getStaticProps() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return { props: { posts } }
}

export default function Blog({ posts }) {
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
```

- Runs **once at `next build`**. Output is static HTML + JSON files on disk.
- Served from CDN. Client-side navigations use the JSON, not HTML.
- Code is excluded from the client bundle entirely.

#### ISR — `getStaticProps` + `revalidate`

```js
export async function getStaticProps() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return { props: { posts }, revalidate: 60 }
}
```

Stale-while-revalidate: after 60 seconds, the next request is served the cached page while Next.js regenerates a fresh one in the background.

On-demand ISR (Next.js 12.2+):

```js
// pages/api/revalidate.js
export default async function handler(req, res) {
  await res.revalidate('/blog/1')
  return res.json({ revalidated: true })
}
```

#### SSR — `getServerSideProps`

```js
// pages/dashboard.js
export async function getServerSideProps(context) {
  const token = context.req.cookies.token
  const data = await fetchUserData(token)
  return { props: { data } }
}
```

- Runs on **every request**. Access to full `req`, `res`, `query`, `params`, cookies, headers.
- Cannot be combined with `revalidate`.

#### Dynamic paths — `getStaticPaths` + `fallback`

```js
export async function getStaticPaths() {
  const posts = await fetch('/api/posts').then(r => r.json())
  return {
    paths: posts.map(p => ({ params: { id: String(p.id) } })),
    fallback: 'blocking', // 'blocking' | true | false
  }
}
```

| `fallback` value | Behaviour for unknown paths |
|---|---|
| `false` | 404 immediately |
| `true` | Show interim fallback UI, generate in background |
| `'blocking'` | Block response (like SSR) until generated, then cache |

#### Pages Router decision tree

| Export | Strategy | When to use |
|---|---|---|
| `getStaticProps` | SSG | Public, cacheable data known at build |
| `getStaticProps` + `revalidate` | ISR | Same but content updates over time |
| `getServerSideProps` | SSR | Personalized, auth-gated, always fresh |
| Neither (useEffect) | CSR | Private, not SEO-sensitive |

---

### Era 2 — Next.js 15 App Router

The App Router replaces explicit function exports with **implicit heuristics**. Next.js reads your component code and infers the rendering mode. The developer uses escape hatches (route segment configs, fetch options) when they need to override the inference.

#### The critical fetch caching change

| Version | `fetch()` default |
|---|---|
| Next.js 13 / 14 | **Cached** (`force-cache`) — you opt out with `no-store` |
| **Next.js 15** | **Not cached** — you opt in with `force-cache` or `next.revalidate` |

This was a breaking change. Code that relied on implicit fetch caching in v13/14 would silently become uncached in v15.

#### What triggers dynamic rendering (automatic)

Next.js statically renders by default unless it detects:

| Dynamic signal | What it is |
|---|---|
| `await cookies()` | Reading request cookies (async in v15) |
| `await headers()` | Reading request headers (async in v15) |
| `searchParams` prop on a page | URL query string access |
| `fetch(..., { cache: 'no-store' })` | Explicit no-cache fetch |
| `export const revalidate = 0` | Route-level no-cache config |
| `await connection()` | Explicit dynamic opt-in (replaces `unstable_noStore`) |

> **Breaking change in v15**: `params`, `cookies()`, `headers()`, `searchParams` are all now **async**. You must `await` them.

#### Route segment config (developer override)

```ts
// page.tsx | layout.tsx | route.ts

// Force fully dynamic (equivalent to getServerSideProps)
export const dynamic = 'force-dynamic'

// Force fully static (cookies/headers return empty values)
export const dynamic = 'force-static'

// Strict static — throw build error if any dynamic API used
export const dynamic = 'error'

// ISR — revalidate every N seconds
export const revalidate = 60

// Never cache
export const revalidate = 0
```

#### ISR in App Router (Next.js 15)

```tsx
// app/blog/[id]/page.tsx
export const revalidate = 60

export default async function Page({ params }) {
  const { id } = await params  // must await in v15
  const post = await fetch(`/api/posts/${id}`, { next: { revalidate: 3600 } })
    .then(r => r.json())
  return <h1>{post.title}</h1>
}
```

On-demand invalidation:

```ts
import { revalidateTag } from 'next/cache'

// Tag a fetch
const data = await fetch('/api/posts', { next: { tags: ['posts'] } })

// Invalidate from a Server Action
revalidateTag('posts')
```

#### Non-fetch caching — `unstable_cache`

For database queries and other non-`fetch` async functions:

```ts
import { unstable_cache } from 'next/cache'

export const getCachedUser = unstable_cache(
  async (id: string) => db.users.findById(id),
  ['user'],
  { tags: ['user'], revalidate: 3600 }
)
```

#### Dynamic path params — `generateStaticParams` + `dynamicParams`

```ts
// app/blog/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('/api/posts').then(r => r.json())
  return posts.map(p => ({ id: String(p.id) }))
}

export const dynamicParams = true  // true = generate on demand (default)
                                   // false = 404 for unknown paths
```

---

### Era 3 — Next.js 16 with Cache Components

Next.js 16 introduces a new opt-in model that changes the default from implicit to **explicit**, and moves caching granularity from route-level to **component/function-level**.

Enabled with one flag:

```ts
// next.config.ts
export default { cacheComponents: true }
```

This also removes `experimental.ppr` and `experimental.dynamicIO` (they are on by default now).

#### The philosophy shift

| | Next.js 15 (previous model) | Next.js 16 (Cache Components) |
|---|---|---|
| Default assumption | Static, unless dynamic signals found | **Dynamic**, unless `'use cache'` applied |
| Caching boundary | Route | Component or function |
| How you cache | Route segment config / fetch options | `'use cache'` directive + `cacheLife()` |
| ISR | `export const revalidate = N` | `'use cache'` + `cacheLife(profile)` |
| PPR | Experimental opt-in flag | **On by default** |
| Build error for dynamic? | No | **Yes** — unhandled dynamic data = build error |

#### `'use cache'` directive

```tsx
// Data function level
export async function getPosts() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM posts')
}

// Component level
async function BlogPosts() {
  'use cache'
  cacheLife('days')
  cacheTag('posts')
  const posts = await fetch('/api/posts').then(r => r.json())
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}

// File level (all exports in file are cached)
'use cache'
export default async function Page() { ... }
```

The compiler auto-generates cache keys from: build ID + function location + all arguments + captured closure variables.

#### `cacheLife` profiles

| Profile | Client stale | Server revalidate | Expire |
|---|---|---|---|
| `default` | 5 min | 15 min | never |
| `seconds` | 30s | 1s | 1 min |
| `minutes` | 5 min | 1 min | 1 hr |
| `hours` | 5 min | 1 hr | 1 day |
| `days` | 5 min | 1 day | 1 week |
| `weeks` | 5 min | 1 week | 30 days |
| `max` | 5 min | 30 days | 1 year |

#### New cache invalidation APIs

| API | Where | Behaviour |
|---|---|---|
| `revalidateTag(tag, profile)` | Server Actions / Route Handlers | SWR — serve stale immediately, regenerate in background |
| `updateTag(tag)` | **Server Actions only** | Read-your-writes — regenerate synchronously, user sees changes immediately |
| `refresh()` | **Server Actions only** | Re-fetch uncached data only (does not touch cache) |

> `revalidateTag` now **requires** a second argument (profile). Single-argument form is deprecated.

#### Route segment configs removed with `cacheComponents`

| Config | Status in Next.js 16 (cacheComponents) |
|---|---|
| `export const dynamic` | Removed — replaced by `'use cache'` + `<Suspense>` |
| `export const revalidate` | Removed — replaced by `cacheLife()` |
| `export const fetchCache` | Removed — replaced by `'use cache'` on the fetch/function |
| `export const dynamicParams` | Still works |
| `export const runtime` | Still works |

---

### Full Three-Era Comparison Table

| Feature | Pages Router (12–13) | Next.js 15 App Router | Next.js 16 (cacheComponents) |
|---|---|---|---|
| **Decision mechanism** | Explicit function export per page | Implicit heuristics + segment config | Explicit `'use cache'` directive per component/function |
| **SSG** | `getStaticProps` | Default (no dynamic signals) | Pure static JSX / sync code auto-included in shell |
| **ISR (time-based)** | `getStaticProps` + `revalidate: N` | `export const revalidate = N` | `'use cache'` + `cacheLife(profile)` |
| **ISR (on-demand)** | `res.revalidate('/path')` | `revalidateTag()` / `revalidatePath()` | `revalidateTag(tag, profile)` or `updateTag(tag)` |
| **SSR (per request)** | `getServerSideProps` | `export const dynamic = 'force-dynamic'` or use dynamic APIs | No `'use cache'` + wrap in `<Suspense>` |
| **CSR** | `useEffect` + client fetch | `'use client'` + `useEffect` | `'use client'` + `useEffect` (unchanged) |
| **Dynamic paths** | `getStaticPaths` + `fallback` | `generateStaticParams` + `dynamicParams` | Same as v15 |
| **Non-fetch caching** | N/A | `unstable_cache` | `'use cache'` on any async function |
| **`fetch()` default** | N/A | **Not cached** (breaking change from v13/14) | **Not cached** (unchanged) |
| **Cache lifetime** | `revalidate` number (seconds) | `revalidate` in fetch or segment config | `cacheLife()` profiles with stale/revalidate/expire |
| **Cache tags** | N/A | `fetch({ next: { tags: [] } })` | `cacheTag()` inside `'use cache'` |
| **PPR** | Not available | Experimental opt-in per route | **Default** with `cacheComponents: true` |
| **Async request APIs** | Sync (`context.req.cookies`) | Async — must `await cookies()`, `await params` | Same (must `await`) |
| **Params on page** | `context.params` (sync) | `params: Promise<{...}>` (must await) | Same as v15 |
| **Build error for uncached dynamic?** | No | No | **Yes** — `Uncached data outside <Suspense>` |
| **Middleware file** | `middleware.ts` | `middleware.ts` | `proxy.ts` (`middleware.ts` deprecated) |

---

### The Mental Model Evolution (Summary)

**Pages Router**: _"What function do I export?"_
One explicit export per page. Binary choice: static or dynamic. All or nothing per route.

**Next.js 15**: _"What APIs do I use inside my component?"_
Implicit inference. Any dynamic API opts the whole route in. Override with segment configs. `fetch()` changed from cached-by-default (v13/14) to uncached-by-default (v15).

**Next.js 16 (Cache Components)**: _"What do I mark with `'use cache'`?"_
Explicit again, but at the component/function level. Everything is dynamic unless you cache it. PPR is automatic. One page can have static shell + cached sections + live streaming sections — all coexisting.

---

## Next.js 15 App Router — Deep Dive with Code Examples

This section explains exactly how a page ends up as SSG, ISR, SSR, or CSR in the Next.js 15 App Router model. The key thing to understand: **Next.js 15 does not ask you to declare a strategy — it infers it from your code.**

---

### How to know what mode a page is in

At build time (`next build`), Next.js prints a symbol next to each route:

```
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

Example output:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    0 B               0 kB
├ ○ /about                               0 B               0 kB
├ ○ /blog                                0 B               0 kB
└ ƒ /dashboard                           0 B               0 kB
```

In development (`next dev`), every page renders dynamically on each request regardless — so always check production build output.

> **Note**: Next.js 15 uses only `○` (Static) and `ƒ` (Dynamic). Older symbols like `λ` (lambda) and `◐` (half-circle) are from pre-v13 Next.js and do not appear in v15 build output.

---

### SSG — Pages that pre-render at build time

A page becomes **SSG** when Next.js can fully render it without any request-specific data. This happens **automatically** — you don't need to do anything special. Just write a Server Component that fetches data, with no dynamic signals.

#### Example 1: Public blog index (fully static)

```tsx
// app/blog/page.tsx
// No 'use client', no cookies(), no headers(), no searchParams
// → Next.js renders this at build time

async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache',  // explicitly opt into caching (safe default in v15)
  })
  return res.json()
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main>
      <h1>All Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/blog/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

**Why it's SSG**: No dynamic signals. The fetch is `force-cache`. Next.js renders it once at `next build` and writes the result to disk.

#### Example 2: Static about page (no fetch at all)

```tsx
// app/about/page.tsx
// Pure component — no data fetching
// → Statically rendered at build time

export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>We build things with Next.js.</p>
    </main>
  )
}
```

**Why it's SSG**: Nothing to infer — no async, no fetch, no dynamic signals. Fully static HTML is generated at build time.

#### Example 3: Dynamic route with `generateStaticParams` (replaces `getStaticPaths`)

```tsx
// app/blog/[id]/page.tsx

// Tell Next.js which [id] values to pre-build
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'force-cache',
  }).then((r) => r.json())

  // Return an array of params objects
  return posts.map((post: { id: number }) => ({
    id: String(post.id),
  }))
}

// By default, dynamicParams = true:
// Paths NOT in generateStaticParams will be generated on-demand and cached
// Set to false to return 404 for unknown paths
export const dynamicParams = true

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }> // params is async in Next.js 15
}) {
  const { id } = await params // must await in v15

  const post = await fetch(`https://api.example.com/posts/${id}`, {
    cache: 'force-cache',
  }).then((r) => r.json())

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

**Why it's SSG**: `generateStaticParams` pre-builds the listed IDs at build time. Unknown IDs are generated on first request and then cached (because `dynamicParams = true`).

> **`dynamicParams` values:**
> - `true` (default): unknown paths are generated on demand then cached — like `fallback: 'blocking'` in Pages Router
> - `false`: unknown paths return 404 — like `fallback: false` in Pages Router

---

### ISR — Pages that rebuild on a schedule or on demand

ISR in Next.js 15 is done by combining static generation with a revalidation interval. The page pre-renders at build time, but Next.js periodically regenerates it in the background (stale-while-revalidate).

#### Example 1: Route-level ISR with `export const revalidate`

```tsx
// app/products/page.tsx

// Rebuild this page at most once every 60 seconds
export const revalidate = 60

async function getProducts() {
  // No cache option needed — the revalidate segment config controls timing
  const res = await fetch('https://api.example.com/products')
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name} — ${p.price}</li>
        ))}
      </ul>
      <p>Last updated: {new Date().toISOString()}</p>
    </main>
  )
}
```

**Why it's ISR**: `export const revalidate = 60` tells Next.js to cache this page but regenerate it in the background after 60 seconds have passed since the last generation.

> The `revalidate` value is the **minimum** interval, not a guarantee. The lowest `revalidate` across all layouts and pages in a route wins.

#### Example 2: Per-fetch ISR with `next.revalidate`

You can set ISR at the individual fetch level instead of the whole route:

```tsx
// app/news/page.tsx
// No route-level revalidate — controlled per fetch

export default async function NewsPage() {
  // This fetch revalidates every 5 minutes
  const headlines = await fetch('https://api.news.com/headlines', {
    next: { revalidate: 300 },
  }).then((r) => r.json())

  // This fetch revalidates every hour
  const featured = await fetch('https://api.news.com/featured', {
    next: { revalidate: 3600 },
  }).then((r) => r.json())

  return (
    <main>
      <section>
        <h2>Headlines</h2>
        {headlines.map((h) => <p key={h.id}>{h.title}</p>)}
      </section>
      <section>
        <h2>Featured</h2>
        {featured.map((f) => <p key={f.id}>{f.title}</p>)}
      </section>
    </main>
  )
}
```

**The route's effective revalidation interval is the lowest value** — in this case, 300 seconds (5 min), driven by the headlines fetch.

#### Example 3: On-demand ISR with `revalidateTag`

Instead of waiting for a time window, you can trigger revalidation from a Server Action or Route Handler when data actually changes:

```tsx
// app/blog/[id]/page.tsx

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Tag this fetch so it can be invalidated on demand
  const post = await fetch(`https://api.example.com/posts/${id}`, {
    next: { tags: [`post-${id}`, 'posts'] },
  }).then((r) => r.json())

  return <article><h1>{post.title}</h1><p>{post.content}</p></article>
}
```

```ts
// app/actions/post.ts
'use server'
import { revalidateTag } from 'next/cache'

export async function publishPost(id: string, content: string) {
  // 1. Write to the database
  await db.posts.update(id, { content, published: true })

  // 2. Invalidate the cache for this specific post
  revalidateTag(`post-${id}`)

  // Or invalidate all posts at once:
  // revalidateTag('posts')
}
```

When `publishPost` is called (e.g., from a CMS webhook or an admin form), Next.js immediately marks the cached page stale. The next visitor triggers a background regeneration.

---

### SSR — Pages that render fresh on every request

A page becomes **SSR** (dynamic) when Next.js detects request-specific data access. This can happen automatically (via dynamic signals) or be forced explicitly.

#### Example 1: Automatic SSR — reading cookies (auth)

```tsx
// app/dashboard/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// No export const dynamic needed — cookies() makes it dynamic automatically

export default async function DashboardPage() {
  const cookieStore = await cookies()       // must await in Next.js 15
  const token = cookieStore.get('session')?.value

  if (!token) {
    redirect('/login')  // redirect if not authenticated
  }

  const user = await fetchUser(token)

  return (
    <main>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
    </main>
  )
}
```

**Why it's SSR**: `cookies()` is a dynamic signal. Next.js sees this at build time and marks the route as dynamic — rendered per request, never cached.

#### Example 2: Automatic SSR — reading headers (geolocation, user-agent)

```tsx
// app/pricing/page.tsx
import { headers } from 'next/headers'

export default async function PricingPage() {
  const headerStore = await headers()      // must await in Next.js 15
  const country = headerStore.get('x-vercel-ip-country') ?? 'US'

  // Show different pricing based on country
  const pricing = await fetchPricingForCountry(country)

  return (
    <main>
      <h1>Pricing for {country}</h1>
      <p>{pricing.monthly}/month</p>
    </main>
  )
}
```

**Why it's SSR**: `headers()` is a dynamic signal. Every user gets a fresh render with their actual request headers.

#### Example 3: Automatic SSR — reading `searchParams` (filtering/pagination)

```tsx
// app/search/page.tsx

// searchParams is a dynamic signal — accessing it makes the page SSR
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }> // async in Next.js 15
}) {
  const { q = '', page = '1' } = await searchParams  // must await

  const results = await fetch(
    `https://api.example.com/search?q=${q}&page=${page}`
  ).then((r) => r.json())

  return (
    <main>
      <h1>Search: "{q}"</h1>
      <p>Page {page}</p>
      <ul>
        {results.items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </main>
  )
}
```

**Why it's SSR**: `searchParams` changes per URL. Next.js renders this fresh on each request.

> **Tip**: If you only need search params for client-side UI (e.g., a filter that doesn't require a server round-trip), use `useSearchParams()` in a Client Component instead — that keeps the page static.

#### Example 4: Forced SSR with `export const dynamic`

Sometimes you want to guarantee SSR even if you don't use any dynamic signals — for example, to always show real-time data:

```tsx
// app/live-scores/page.tsx

// Explicitly opt into SSR — never cache this page
export const dynamic = 'force-dynamic'

export default async function LiveScoresPage() {
  // Even with force-cache here, the route config overrides it
  const scores = await fetch('https://api.sports.com/scores').then((r) => r.json())

  return (
    <main>
      <h1>Live Scores</h1>
      <p>As of: {new Date().toLocaleTimeString()}</p>
      {scores.map((s) => (
        <div key={s.id}>{s.home} {s.homeScore} – {s.awayScore} {s.away}</div>
      ))}
    </main>
  )
}
```

**Why it's SSR**: `export const dynamic = 'force-dynamic'` explicitly forces every request to re-render — equivalent to `getServerSideProps` in Pages Router.

#### Example 5: Forced SSR with `revalidate = 0`

```tsx
// app/ticker/page.tsx

// revalidate: 0 makes the route always dynamically rendered.
// Unlike force-dynamic, it leaves explicitly force-cached fetches untouched.
export const revalidate = 0

export default async function TickerPage() {
  const price = await fetch('https://api.exchange.com/btc-price').then((r) => r.json())

  return <p>BTC: ${price.usd}</p>
}
```

---

### CSR — Components that render in the browser

CSR in Next.js 15 App Router is **not a page-level strategy** — it is a component-level choice. The page is still server-rendered (SSG or SSR), but specific interactive components inside it are marked `'use client'` and run only in the browser.

#### Example 1: A static page with a client-only interactive widget

```tsx
// app/contact/page.tsx
// This page itself is SSG — no dynamic signals

import ContactForm from '@/components/ContactForm'

export default function ContactPage() {
  return (
    <main>
      <h1>Contact Us</h1>
      <p>Fill in the form below.</p>
      <ContactForm />   {/* this is a Client Component */}
    </main>
  )
}
```

```tsx
// components/ContactForm.tsx
'use client'                     // runs in the browser

import { useState } from 'react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/contact', { method: 'POST' })
    setSubmitted(true)
  }

  if (submitted) return <p>Thanks! We will be in touch.</p>

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <button type="submit">Send</button>
    </form>
  )
}
```

**The page** (`ContactPage`) is SSG — pre-rendered at build time.
**The form** (`ContactForm`) is CSR — interactive state (`useState`) runs only in the browser. The server sends its initial HTML as part of the SSG output; React hydrates it on the client.

#### Example 2: CSR-only data fetching (not SEO-sensitive)

```tsx
// app/profile/page.tsx
// The shell is SSG (no dynamic signals on the page itself)

import UserProfile from '@/components/UserProfile'

export default function ProfilePage() {
  return (
    <main>
      <h1>Your Profile</h1>
      <UserProfile />
    </main>
  )
}
```

```tsx
// components/UserProfile.tsx
'use client'

import { useState, useEffect } from 'react'

export default function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading profile...</p>
  if (!user) return <p>Please log in.</p>
  return <p>Hello, {user.name}</p>
}
```

**Why CSR for the data fetch**: The user's profile is private and user-specific — there is no value in server-rendering it. The page shell is static (fast CDN delivery), the personalized data fetches client-side after hydration.

> **When to use CSR for data**: User-specific data that changes frequently, doesn't need SEO, or depends on browser APIs (localStorage, geolocation). Prefer Server Components + `cookies()` for auth-gated pages that need SEO.

---

### Mixed mode — SSG shell + SSR parts + CSR interactions

The most realistic real-world pages combine all three. Here is a complete e-commerce product page as an example:

```tsx
// app/products/[id]/page.tsx
import { Suspense } from 'react'
import AddToCartButton from '@/components/AddToCartButton'
import ReviewsSection from '@/components/ReviewsSection'

// Pre-build popular product pages at build time
export async function generateStaticParams() {
  const popular = await fetch('https://api.shop.com/popular-products', {
    cache: 'force-cache',
  }).then((r) => r.json())
  return popular.map((p) => ({ id: String(p.id) }))
}

export const revalidate = 3600   // ISR: refresh product data every hour
export const dynamicParams = true // generate unknown IDs on demand

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // This fetch is ISR-controlled by the route's revalidate = 3600
  const product = await fetch(`https://api.shop.com/products/${id}`, {
    next: { tags: [`product-${id}`] },  // tag for on-demand invalidation
  }).then((r) => r.json())

  return (
    <main>
      {/* SSG/ISR section — same for all users */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <img src={product.imageUrl} alt={product.name} />

      {/* CSR — client-side interactivity, needs useState */}
      <AddToCartButton productId={id} />

      {/* Reviews: loaded separately, can have its own revalidation */}
      <Suspense fallback={<p>Loading reviews...</p>}>
        <ReviewsSection productId={id} />
      </Suspense>
    </main>
  )
}
```

```tsx
// components/AddToCartButton.tsx
'use client'

import { useState } from 'react'

export default function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false)

  async function handleAdd() {
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    })
    setAdded(true)
  }

  return (
    <button onClick={handleAdd} disabled={added}>
      {added ? 'Added to Cart ✓' : 'Add to Cart'}
    </button>
  )
}
```

```tsx
// components/ReviewsSection.tsx
// Server Component — no 'use client'
// next: { revalidate: 300 } on this fetch sets the Data Cache TTL for reviews.
// Because 300 < 3600 (the page's revalidate), the entire route ends up
// regenerating every 300s — the minimum wins for the Full Route Cache.

async function ReviewsSection({ productId }: { productId: string }) {
  const reviews = await fetch(
    `https://api.shop.com/products/${productId}/reviews`,
    { next: { revalidate: 300, tags: [`reviews-${productId}`] } }
  ).then((r) => r.json())

  return (
    <section>
      <h2>Reviews ({reviews.length})</h2>
      {reviews.map((r) => (
        <div key={r.id}>
          <p>{r.author}: {r.text}</p>
        </div>
      ))}
    </section>
  )
}

export default ReviewsSection
```

> **v15 caveat — no truly independent per-component revalidation without PPR**: In Next.js 15 without PPR enabled, the entire route's Full Route Cache revalidates at the *lowest* `revalidate` across all fetches and segment configs. So `ReviewsSection`'s `revalidate: 300` drives the whole page to revalidate every 5 minutes, not just the reviews section. True component-level independent revalidation requires either PPR (`experimental.ppr: 'incremental'` in v15) or Next.js 16 Cache Components.

**What each part does:**

| Part | Mode | Why |
|---|---|---|
| `ProductPage` shell | **ISR** (5min effective) | Reviews fetch's 300s is lower than page's 3600s — minimum wins |
| Pre-built popular products | **SSG** | Zero latency on most visited pages |
| Unknown product IDs | **Generated on demand then cached** | `dynamicParams = true` |
| `AddToCartButton` | **CSR** | Needs `useState`, user interaction — no SSR needed |
| `ReviewsSection` fetch | **ISR** (5min, drives route) | 300s revalidate is the lowest — sets the whole route's cadence |
| On-demand cache bust | **On-demand ISR** | `revalidateTag('product-${id}')` from admin action |

---

### Quick reference: what makes a Next.js 15 page each mode

| You want... | Do this |
|---|---|
| **SSG** | Write a Server Component with no dynamic signals. Use `cache: 'force-cache'` on fetches. |
| **SSG with dynamic routes** | Add `generateStaticParams()`. Set `dynamicParams` as needed. |
| **ISR (time-based)** | Add `export const revalidate = N` to the page, or `next: { revalidate: N }` per fetch. |
| **ISR (on-demand)** | Tag fetches with `next: { tags: ['name'] }`, call `revalidateTag('name')` from a Server Action. |
| **SSR** | Use `cookies()`, `headers()`, or `await searchParams`. Or add `export const dynamic = 'force-dynamic'`. |
| **CSR** | Add `'use client'` to a component, use `useEffect` for data fetching. |
| **Force static even with dynamic APIs** | `export const dynamic = 'force-static'` (cookies/headers return empty). |
| **Throw if accidentally dynamic** | `export const dynamic = 'error'`. |
