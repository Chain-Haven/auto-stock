# Deploy setup — COMPLETE ✓

## Production URLs

| Service | URL |
|---------|-----|
| **App** | https://auto-stock.vercel.app |
| **Supabase** | https://xyozzvvfemvudtfauvss.supabase.co |
| **GitHub** | https://github.com/Chain-Haven/auto-stock |

## 1. GitHub

- **Repo:** https://github.com/Chain-Haven/auto-stock
- **Status:** Pushed; `main` is the default branch.

## 2. Supabase

- **Project:** auto-stock (id: `xyozzvvfemvudtfauvss`)
- **URL:** https://xyozzvvfemvudtfauvss.supabase.co
- **Status:** ACTIVE_HEALTHY
- **Migrations:** All 10 migrations applied:
  1. profiles
  2. organizations
  3. connections_stores
  4. catalog_products_inventory
  5. quotes_pos
  6. jobs_shipments_invoices
  7. integrations_audit
  8. inventory_ledger
  9. capacity
  10. po_stages_collab

## 3. Vercel

- **Project:** auto-stock (chain-havens-projects)
- **Dashboard:** https://vercel.com/chain-havens-projects/auto-stock
- **Production URL:** https://auto-stock.vercel.app
- **Status:** DEPLOYED ✓

### Configuration (already set)

| Setting | Value |
|---------|-------|
| Root Directory | `apps/web` |
| Framework | Next.js |
| Node.js Version | 24.x |

### Environment Variables (already set)

| Name | Environments |
|------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |

## 4. Builds (verified)

- `pnpm run lint` — **passes** ✓
- `pnpm run typecheck` — **passes** ✓
- `pnpm run build` — **passes** ✓
- `pnpm plugin:build` — **passes** ✓ (artifact: `apps/woo-plugin/dist/merchant-connector.zip`)

## 5. Security

- Next.js updated to **15.5.11** (patched for CVE-2025-66478)
- Sentry source maps deleted after upload
- RLS policies applied to all tables

## 6. Costs

- Supabase project: **$10/month**
- Vercel: Free tier (Hobby)
