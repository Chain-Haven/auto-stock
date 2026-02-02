# Deploy setup (done for you)

## 1. GitHub

- **Repo:** https://github.com/Chain-Haven/auto-stock
- **Status:** Pushed; `main` is the default branch.

## 2. Supabase

- **Project:** auto-stock (id: `xyozzvvfemvudtfauvss`)
- **URL:** https://xyozzvvfemvudtfauvss.supabase.co
- **Anon key (legacy):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5b3p6dnZmZW12dWR0ZmF1dnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzg2NzAsImV4cCI6MjA4NTYxNDY3MH0.MfKYAs_wA1gnGSDj0SpBfhck-poaPPD_qPU_dlu6Hts`
- **Migrations:** All 10 migrations have been applied (profiles, organizations, connections_stores, catalog_products_inventory, quotes_pos, jobs_shipments_invoices, integrations_audit, inventory_ledger, capacity, po_stages_collab).

## 3. Vercel

- **Project:** auto-stock (chain-havens-projects)
- **Inspect (last deploy):** https://vercel.com/chain-havens-projects/auto-stock/6DMMZ7FFChVVhe5UQz5tX69mWVLM
- **Preview URL from that deploy:** https://auto-stock-abay73mpr-chain-havens-projects.vercel.app (build succeeded; deploy failed due to Output Directory — see below).

**To get a working production URL:**

1. In [Vercel Dashboard](https://vercel.com/chain-havens-projects/auto-stock) → **Settings** → **General**:
   - Set **Root Directory** to `apps/web` and save.
2. **Settings** → **Environment Variables** — add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://xyozzvvfemvudtfauvss.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (anon key above)
   - Optional: Sentry DSN, org, project.
3. **Redeploy:** Deployments → … on latest → **Redeploy**, or push a new commit to `main`.

After that, the production URL will be https://auto-stock-*.vercel.app or your custom domain.

## 4. Builds (verified)

- `pnpm --filter web build` — **succeeds**
- `pnpm plugin:build` — **succeeds** (artifact: `apps/woo-plugin/dist/merchant-connector.zip`)

## 5. One-time cost

- Supabase project: **$10/month** (confirmed at creation).
