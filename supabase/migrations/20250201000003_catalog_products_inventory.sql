-- catalog: manufacturer product catalog (MOQ, lead time, tiers)
create table if not exists public.catalog (
  id uuid primary key default gen_random_uuid(),
  manufacturer_org_id uuid not null references public.organizations (id) on delete cascade,
  sku text not null,
  name text not null,
  description text,
  moq integer not null default 1,
  lead_time_days integer not null default 0,
  base_price_cents bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (manufacturer_org_id, sku)
);

create index if not exists catalog_manufacturer_idx on public.catalog (manufacturer_org_id);

alter table public.catalog enable row level security;

create policy "Manufacturer org members can manage own catalog"
  on public.catalog for all
  using (
    manufacturer_org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- Connected merchants can read catalog (for quoting)
create policy "Connected merchants can read catalog"
  on public.catalog for select
  using (
    manufacturer_org_id in (
      select manufacturer_org_id from public.connections
      where merchant_org_id in (select org_id from public.profiles where id = auth.uid())
      and status = 'accepted'
    )
  );

create trigger catalog_updated_at
  before update on public.catalog
  for each row execute function public.set_updated_at();

-- products: merchant-facing product (may link to catalog or be custom)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  merchant_org_id uuid not null references public.organizations (id) on delete cascade,
  sku text not null,
  name text,
  catalog_id uuid references public.catalog (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (merchant_org_id, sku)
);

create index if not exists products_merchant_idx on public.products (merchant_org_id);
create index if not exists products_catalog_idx on public.products (catalog_id);

alter table public.products enable row level security;

create policy "Merchant org members can manage own products"
  on public.products for all
  using (
    merchant_org_id in (select org_id from public.profiles where id = auth.uid())
  );

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- inventory: snapshot per store/product (ledger in separate table for M3)
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (store_id, product_id)
);

create index if not exists inventory_store_idx on public.inventory (store_id);
create index if not exists inventory_product_idx on public.inventory (product_id);

alter table public.inventory enable row level security;

create policy "Merchant org members can read inventory via stores"
  on public.inventory for select
  using (
    store_id in (
      select id from public.stores
      where merchant_org_id in (select org_id from public.profiles where id = auth.uid())
    )
  );

create policy "Merchant org members can update inventory via stores"
  on public.inventory for all
  using (
    store_id in (
      select id from public.stores
      where merchant_org_id in (select org_id from public.profiles where id = auth.uid())
    )
  );

create trigger inventory_updated_at
  before update on public.inventory
  for each row execute function public.set_updated_at();
