# Auto-Stock

Inventory automation SaaS + WooCommerce plugin: multi-store sync, manufacturer collaboration, quotes → POs → shipping → invoicing.

## Stack

- **Monorepo**: pnpm workspaces
- **App**: Next.js 15 (App Router), TypeScript, Tailwind, shadcn/ui
- **Backend**: Supabase (Auth, Postgres, RLS)
- **Observability**: Sentry (client + server)

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Next.js dev server (web app) |
| `pnpm lint` | ESLint across workspace |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm e2e` | Playwright E2E (starts dev server if no BASE_URL) |
| `pnpm e2e:ui` | Playwright UI mode |
| `pnpm verify` | lint + typecheck + test + e2e |
| `pnpm plugin:build` | Build WooCommerce plugin artifact |
| `pnpm smoke:public` | Smoke E2E against public URL (set BASE_URL) |

## Local setup

1. Clone and install: `pnpm install`
2. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (create a project at [supabase.com](https://supabase.com) or use Supabase MCP)
   - Optional: Sentry DSN for error tracking
3. Apply migrations (Supabase CLI or MCP): run SQL in `supabase/migrations/` against your project.
4. Playwright browsers (first time): `cd apps/web && pnpm exec playwright install chromium`
5. For `pnpm verify`: ensure port 3000 is free (or set `BASE_URL` to an already-running app URL so E2E skips starting the dev server).

## PowerShell commands (Windows)

```powershell
pnpm install
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run e2e
pnpm verify
# E2E against public URL:
$env:BASE_URL = "https://your-app.vercel.app"
pnpm run e2e
```

## Milestones

- **M1** — Scaffold, Auth, Onboarding, Sentry, tests, .cursor rails ✅
- **M2** — Full schema, RLS, admin health ✅
- **M3** — Merchant stores, inventory, sync health, notifications ✅
- **M4** — Manufacturer catalog, capacity, Orders Hub ✅
- **M5** — Connections, negotiated pricing ✅
- **M6** — Quotes, POs, manufacturing stages, collaboration ✅
- **M7** — ShipStation + RMA Lite (API stubs) ✅
- **M8** — Mercury invoicing (API stubs) ✅
- **M9** — WooCommerce plugin (pairing, webhook, import) ✅
- **M10** — AI copilots, CI, public launch ✅

## Production & public launch

- **Public Vercel URL**: Set after first deploy (e.g. `https://auto-stock-xxx.vercel.app`). Configure in Vercel dashboard and set `BASE_URL` for E2E.
- **Plugin artifact**: `apps/woo-plugin/dist/merchant-connector.zip` — build with `pnpm plugin:build`. Install in WooCommerce: Plugins → Add New → Upload Plugin → select zip. Pairing: use dashboard to generate one-time code; enter in plugin settings.
- **Sentry**: Set `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` in Vercel. Source maps and release tagging use `VERCEL_GIT_COMMIT_SHA`. Verify: trigger test error at `/error` or `/api/sentry-test` and confirm event in Sentry.
- **CI artifact locations**: Playwright report uploaded as `playwright-report` (retention 7 days) in GitHub Actions after E2E.

## Final report (production-ready checklist)

- **Public Vercel URL**: Deploy via Vercel (connect repo or `vercel` CLI). Set env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, optional Sentry DSN. Run migrations against your Supabase project.
- **Plugin artifact path**: `apps/woo-plugin/dist/merchant-connector.zip`. Install/pairing: see "Plugin artifact" above.
- **PowerShell commands** (Windows):
  - `pnpm install`
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `pnpm run test`
  - `pnpm run build` (web)
  - `pnpm plugin:build` (plugin zip)
  - `$env:BASE_URL = "https://your-app.vercel.app"; pnpm run e2e` (E2E against public)
  - `$env:BASE_URL = "https://your-app.vercel.app"; node apps/web/scripts/smoke-public.js` (smoke)
- **1:1 requirement mapping**: See [docs/requirement-mapping.md](docs/requirement-mapping.md).

## Requirement mapping

See [docs/requirement-mapping.md](docs/requirement-mapping.md).
