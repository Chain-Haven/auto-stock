# Security

## M1 baseline

- **Supabase**: Auth + RLS on every table. Client uses only anon key; never service_role in the browser.
- **Middleware**: Session refresh only when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set; otherwise pass-through.
- **Server/client**: When Supabase env is missing, server and browser clients return mocks (no user, no DB) so the app runs for E2E/smoke without a project.

## RLS policies (M2+)

Every table has RLS enabled. Scoping is by `auth.uid()` and/or org membership via `profiles.org_id`.

| Table | Select | Insert | Update | Delete |
|-------|--------|--------|--------|--------|
| **profiles** | own row | own row | own row | — |
| **organizations** | org member | any (app creates on onboarding) | own org | — |
| **connections** | merchant or manufacturer org member | merchant org | manufacturer org (accept/reject) | — |
| **stores** | merchant org | merchant org | merchant org | merchant org |
| **catalog** | manufacturer org (manage); connected merchants (read) | manufacturer org | manufacturer org | manufacturer org |
| **products** | merchant org | merchant org | merchant org | merchant org |
| **inventory** | merchant org via stores | merchant org via stores | merchant org via stores | merchant org via stores |
| **quotes** | merchant or manufacturer org | merchant org | manufacturer org | — |
| **quote_lines** | via quote visibility | via quote | via quote | via quote |
| **purchase_orders** | merchant or manufacturer org | service/app | manufacturer org (status) | — |
| **po_lines** | via PO visibility | via PO | via PO | via PO |
| **jobs** | authenticated (admin UI) | service_role | service_role | service_role |
| **shipments** | via PO | manufacturer org via PO | manufacturer org | — |
| **invoices** | via PO org | service_role | service_role | — |
| **integrations** | org member | org member | org member | org member |
| **negotiated_pricing** | connection party | manufacturer org | manufacturer org | manufacturer org |
| **notifications** | own user_id | system | own (mark read) | — |
| **audit_log** | authenticated (app-scoped) | service_role | — | — |

No cross-tenant access: tenant A cannot see tenant B's data. Negative tests assert this.
