-- inventory_ledger: append-only log of inventory changes (idempotent updates)
create table if not exists public.inventory_ledger (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  delta integer not null,
  reason text,
  reference_id text,
  created_at timestamptz not null default now()
);

create index if not exists inventory_ledger_store_product_idx on public.inventory_ledger (store_id, product_id, created_at desc);

alter table public.inventory_ledger enable row level security;

create policy "Merchant org can read ledger via stores"
  on public.inventory_ledger for select
  using (
    store_id in (
      select id from public.stores
      where merchant_org_id in (select org_id from public.profiles where id = auth.uid())
    )
  );

create policy "Merchant org can insert ledger via stores"
  on public.inventory_ledger for insert
  with check (
    store_id in (
      select id from public.stores
      where merchant_org_id in (select org_id from public.profiles where id = auth.uid())
    )
  );
