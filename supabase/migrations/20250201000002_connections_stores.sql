-- connections: merchant <-> manufacturer relationship
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  merchant_org_id uuid not null references public.organizations (id) on delete cascade,
  manufacturer_org_id uuid not null references public.organizations (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (merchant_org_id, manufacturer_org_id)
);

create index if not exists connections_merchant_idx on public.connections (merchant_org_id);
create index if not exists connections_manufacturer_idx on public.connections (manufacturer_org_id);

alter table public.connections enable row level security;

create policy "Merchant org members can read connections"
  on public.connections for select
  using (
    merchant_org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Manufacturer org members can read connections"
  on public.connections for select
  using (
    manufacturer_org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Merchant org members can insert connections"
  on public.connections for insert
  with check (
    merchant_org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Manufacturer org members can update connections (accept/reject)"
  on public.connections for update
  using (
    manufacturer_org_id in (select org_id from public.profiles where id = auth.uid())
  );

create trigger connections_updated_at
  before update on public.connections
  for each row execute function public.set_updated_at();

-- stores: WooCommerce stores belonging to merchant
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  merchant_org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  site_url text,
  woo_consumer_key_encrypted text,
  woo_consumer_secret_encrypted text,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stores_merchant_idx on public.stores (merchant_org_id);

alter table public.stores enable row level security;

create policy "Merchant org members can manage own stores"
  on public.stores for all
  using (
    merchant_org_id in (select org_id from public.profiles where id = auth.uid())
  );

create trigger stores_updated_at
  before update on public.stores
  for each row execute function public.set_updated_at();
