<!-- BEGIN:nextjs-agent-rules -->
# nextjs-16-training-2026 — agent rules

This is **Next.js 16** with breaking changes — APIs, conventions, and file structure differ from older training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js code. Key v16 rules:

- **`params` / `searchParams`** are Promises — `await` them in pages and `generateMetadata`.
- **`cookies()` / `headers()` / `draftMode()`** are async only — no sync versions.
- **Turbopack** is the default for `dev` and `build` — no `--turbopack` flag.

## Cache Components — stay off

Do **not** add `cacheComponents` to `next.config.ts`. This teaching repo keeps Cache Components **OFF** (the v16 default) so async data fetching "just works" without PPR/caching build errors. Caching is a day-2 topic only.

## Tooling

- **pnpm** — `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm format`.
- **Biome** — `pnpm lint` = `biome check`, `pnpm format` = `biome format --write`. Never add ESLint or Prettier.

## Teaching repo conventions

- Keep demos **minimal and readable** — no extraneous abstractions or production patterns.
- Mock data lives in `src/lib/data.ts`; route handlers in `src/app/api/`.
- Full demo spec: `.cursor/plan.md` (sections 4, 7, 8).

## Teaching scripts (`teaching-scripts/`)

- One script per session, authored and committed **on that session's branch** (alongside the code), before branching to the next session.
- Generate from what was **actually built** — real file paths, routes, and v16 gotchas. Never invent demos.
- **Always include Mermaid diagrams** to explain concepts visually. Aim for one diagram per major concept, e.g.:
  - file-tree → URL mapping (`flowchart`)
  - request/render flow, esp. `loading.tsx`/Suspense streaming (`sequenceDiagram`)
  - branching logic like render / `notFound()` / `throw` (`flowchart` decision tree)
  - layout nesting / what re-renders on navigation (`flowchart`)
- Mermaid rules: fence with ```` ```mermaid ````; use `<br/>` (not `\n`) for line breaks in node labels; put a one-line **"Say:"** narration cue under each diagram so the instructor knows how to present it.
- Keep the per-session template: header (title, duration, build-along branch, learning goal) → pre-flight (watch-demo + build-along) → opening hook → demo-by-demo (paths, Say/Show/Ask, gotcha) → recap → time budget.

## Branch model (locked)

Dedicated per-session branches, **chained**: each is branched from the previous session's tip, built, committed, and pushed. The final session branch is merged into `main`, where the companion docs are then committed. Build along by checking out the **previous** session's branch.

| Branch | Branched from | Contents |
|---|---|---|
| `session-0-scaffold` | `main` @ scaffold | Clean scaffold + docs + agent rules |
| `session-1-routing` | `session-0-scaffold` | + nav hub, `(s1-routing)/` routes, `src/lib/data.ts` |
| `session-2-components` | `session-1-routing` | + `(s2-components)/` routes, `/api/users` |
| `session-3-actions` | `session-2-components` | + `(s3-actions)/` routes |
| `session-4-antipatterns` | `session-3-actions` | + `/anti-patterns` |
| `main` | merge of `session-4-antipatterns` | Full course + `teaching-scripts/`, `INSTRUCTOR.md`, `CHEATSHEET.md`, `README.md` |

**Watch demo** → `main`. **Build along** → previous session's branch (e.g. build S2 from `session-1-routing`). `main` stays at the scaffold until the final merge.
<!-- END:nextjs-agent-rules -->
