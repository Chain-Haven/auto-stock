# Requirement mapping

| Requirement | Repo path | UI route | Test(s) | Artifact(s) |
|-------------|-----------|----------|---------|--------------|
| M1: Monorepo + Next.js + Tailwind + shadcn | pnpm-workspace.yaml, apps/web | / | — | — |
| M1: Supabase Auth (signup/login/logout) | apps/web/src/lib/supabase, (auth)/login, (auth)/signup, dashboard layout | /login, /signup, /dashboard | e2e/auth.spec.ts, unit profile.test.ts | — |
| M1: Role selection + org (profiles) | supabase/migrations/...profiles.sql, signup page | /signup | profile.test.ts | — |
| M1: Onboarding setup checklist | components/onboarding/setup-checklist.tsx, dashboard | /dashboard | e2e auth | — |
| M1: Sentry client + server | sentry.*.config.ts, instrumentation.ts, app/error, api/sentry-test | /error, /api/sentry-test | — | — |
| M1: Vitest + Playwright | vitest.config.ts, playwright.config.ts, e2e/, src/**/*.test.ts | — | pnpm verify | playwright-report |
| M1: .cursor rails | .cursor/rules, commands, agents, skills, cli.json | — | — | — |
| M2: Core schema + RLS | supabase/migrations/*.sql, docs/security.md | — | rls-helpers.test.ts, cross-tenant.spec.ts | — |
| M2: Ops Health admin | app/dashboard/admin/health/page.tsx | /dashboard/admin/health | cross-tenant.spec.ts | — |
| M3: Merchant stores + inventory + sync health + notifications | dashboard/stores, inventory, notifications, sync-health-panel | /dashboard/stores, /inventory, /notifications | merchant-inventory.spec.ts, inventory-ledger.test.ts | — |
| M4: Manufacturer catalog + capacity + Orders Hub | dashboard/catalog, catalog/new, capacity, orders | /dashboard/catalog, /capacity, /orders | manufacturer-catalog.spec.ts, capacity-eta.test.ts | — |
| M5: Connections + negotiated pricing | dashboard/connections, pricing, price-resolver | /dashboard/connections, /pricing | price-resolver.test.ts | — |
| M6: Quotes + POs + stages + collaboration | quote-po.ts, manufacturing_stages, collaboration_feed migrations | /dashboard/orders | quote-po.test.ts | — |
| M7: ShipStation + RMA Lite | api/shipstation/test, integrations (shipstation) | — | — | — |
| M8: Mercury invoicing | api/mercury/test, invoices table | — | — | — |
| M9: WooCommerce plugin | apps/woo-plugin, merchant-connector.php, pairing/webhook/import | — | — | apps/woo-plugin/dist/merchant-connector.zip |
| M10: AI copilots + CI + public | dashboard/copilot, .github/workflows/ci.yml, Sentry | /dashboard/copilot | smoke.spec.ts, smoke:public | playwright-report (CI) |
