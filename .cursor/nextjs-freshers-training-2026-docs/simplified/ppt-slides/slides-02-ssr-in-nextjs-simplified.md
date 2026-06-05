# Session 2: Server-Side Rendering (SSR) in Next.js

- Duration: 45 minutes
- Goal: understand SSR and modern Next.js rendering
- Focus: Server Components, hydration, streaming, and dynamic pages

---

## Rendering Strategies (Quick View)

- `SSG`: build once, serve many times
- `ISR`: static pages refreshed in background
- `SSR`: render fresh HTML on each request
- `CSR`: render in browser after JavaScript loads

```mermaid
flowchart LR
    A[Choose rendering strategy] --> B{How often data changes?}
    B -->|Rarely| SSG[SSG]
    B -->|Sometimes| ISR[ISR]
    B -->|Every request / personalized| SSR[SSR]
    B -->|SEO not important + very interactive| CSR[CSR]
```

---

## CSR Recap (Why It Can Feel Slow)

- Browser often receives minimal HTML first
- JavaScript must download before UI fully appears
- Data is fetched after app boots
- Result: slower first meaningful paint

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant API as API
    U->>B: Open page
    B-->>U: Minimal HTML
    B->>B: Download + run JS
    B->>API: Fetch page data
    API-->>B: Data response
    B-->>U: Full UI appears
```

---

## SSR Basics + Hydration

- Server fetches data and sends full HTML first
- Users see content earlier than CSR
- Then React hydrates to attach events
- Hydration = page becomes interactive

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Next.js Server
    participant DB as Data Source
    B->>N: Request page
    N->>DB: Fetch required data
    DB-->>N: Data
    N-->>B: Full HTML (content visible)
    N-->>B: JS bundle
    B->>B: Hydration (events become active)
```

---

## React Server Components (RSC)

- Default in `app/` routes
- Run only on server, not in browser
- Can fetch from database/services directly
- Reduce client JavaScript bundle size

---

## Client Components (`'use client'`)

- Use only when interactivity is needed
- Needed for `useState`, `useEffect`, and event handlers
- Needed for browser APIs (`window`, `localStorage`)
- Keep client boundaries small for better performance

---

## Data Fetching in Server Components

- Prefer direct `async/await` in server components
- Avoid client-side waterfalls for core page data
- Fetch independent data in parallel with `Promise.all`
- Keep secrets and DB credentials on server

```mermaid
flowchart LR
    A[Start render] --> B[getUser()]
    A --> C[getPosts()]
    B --> D[Promise.all]
    C --> D
    D --> E[Render with both results]
```

---

## Streaming with Suspense

- Don’t block whole page on one slow section
- Send ready UI first, stream slow parts later
- Use `loading.tsx` for route-level fallback
- Use `<Suspense>` for component-level fallback

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Next.js
    participant S as Slow Component
    B->>N: Request dashboard
    N-->>B: Header + fast content + fallback
    N->>S: Resolve slow data
    S-->>N: Data ready
    N-->>B: Stream final UI chunk
```

---

## Static vs Dynamic Rendering

- Static: pre-rendered at build time (fast + CDN friendly)
- Dynamic: rendered per request (personalized/fresh)
- Dynamic triggers include request-based inputs
- Choose based on freshness and personalization needs

```mermaid
flowchart TD
    A[Render decision] --> B{Uses request-specific data?}
    B -->|No| C[Static]
    B -->|Yes: cookies/headers/searchParams/uncached fetch| D[Dynamic]
    C --> E[Build time + CDN]
    D --> F[Per-request render]
```

---

## Quick Quiz + Key Takeaways

- When would you pick SSR over SSG?
- Why should `'use client'` be used sparingly?
- How does hydration differ from initial HTML render?
- SSR improves first load + SEO; streaming improves perceived speed
