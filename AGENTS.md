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

## Branch model (locked)

All work happens on **`main`**. The four `session-N-<topic>-start` branches are read-only snapshots created with `git branch <name>` (pointer at HEAD, no checkout). Never commit onto a session branch.

| Branch | State captured |
|---|---|
| `session-1-routing-start` | Clean scaffold + docs + agent rules |
| `session-2-components-start` | After S1 routing built |
| `session-3-actions-start` | After S2 components built |
| `session-4-antipatterns-start` | After S3 actions built |

`main` ends ahead of `session-4-antipatterns-start` (S4 + companion docs).
<!-- END:nextjs-agent-rules -->
