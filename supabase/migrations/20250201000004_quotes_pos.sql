-- quotes: merchant request, manufacturer response
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.connections (id) on delete restrict,
  merchant_org_id uuid not null references public.organizations (id) on delete restrict,
  manufacturer_org_id uuid not null references public.organizations (id) on delete restrict,
  status text not null default 'draft' check (status in ('draft', 'requested', 'quoted', 'accepted', 'rejected')),
  total_cents bigint,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quotes_connection_idx on public.quotes (connection_id);
create index if not exists quotes_merchant_idx on public.quotes (merchant_org_id);
create index if not exists quotes_manufacturer_idx on public.quotes (manufacturer_org_id);

alter table public.quotes enable row level security;

create policy "Merchant or manufacturer org can read own quotes"
  on public.quotes for select
  using (
    merchant_org_id in (select org_id from public.profiles where id = auth.uid())
    or manufacturer_org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Merchant org can insert quotes"
  on public.quotes for insert
  with check (
    merchant_org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Manufacturer org can update quotes (quote back)"
  on public.quotes for update
  using (
    manufacturer_org_id in (select org_id from public.profiles where id = auth.uid())
  );

create trigger quotes_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

-- quote_lines: line items on a quote
create table if not exists public.quote_lines (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes (id) on delete cascade,
  catalog_id uuid references public.catalog (id) on delete set null,
  sku text not null,
  quantity integer not null,
  unit_price_cents bigint,
  created_at timestamptz not null default now()
);

create index if not exists quote_lines_quote_idx on public.quote_lines (quote_id);

alter table public.quote_lines enable row level security;

create policy "Quote access via quotes RLS"
  on public.quote_lines for all
  using (
    quote_id in (select id from public.quotes where merchant_org_id in (select org_id from public.profiles where id = auth.uid()) or manufacturer_org_id in (select org_id from public.profiles where id = auth.uid()))
  );

-- purchase_orders: created from accepted quote
create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes (id) on delete restrict,
  connection_id uuid not null references public.connections (id) on delete restrict,
  merchant_org_id uuid not null references public.organizations (id) on delete restrict,
  manufacturer_org_id uuid not null references public.organizations (id) on delete restrict,
  status text not null default 'open' check (status in ('open', 'in_production', 'shipped', 'closed', 'cancelled')),
  total_cents bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists purchase_orders_quote_idx on public.purchase_orders (quote_id);
create index if not exists purchase_orders_merchant_idx on public.purchase_orders (merchant_org_id);
create index if not exists purchase_orders_manufacturer_idx on public.purchase_orders (manufacturer_org_id);

alter table public.purchase_orders enable row level security;

create policy "Merchant or manufacturer org can read own POs"
  on public.purchase_orders for select
  using (
    merchant_org_id in (select org_id from public.profiles where id = auth.uid())
    or manufacturer_org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "System can insert POs" on public.purchase_orders for insert with check (true);
create policy "Manufacturer can update PO status" on public.purchase_orders for update
  using (manufacturer_org_id in (select org_id from public.profiles where id = auth.uid()));

create trigger purchase_orders_updated_at
  before update on public.purchase_orders
  for each row execute function public.set_updated_at();

-- po_lines: line items on a PO (locked from quote)
create table if not exists public.po_lines (
  id uuid primary key default gen_random_uuid(),
  po_id uuid not null references public.purchase_orders (id) on delete cascade,
  catalog_id uuid references public.catalog (id) on delete set null,
  sku text not null,
  quantity integer not null,
  unit_price_cents bigint not null,
  created_at timestamptz not null default now()
);

create index if not exists po_lines_po_idx on public.po_lines (po_id);

alter table public.po_lines enable row level security;

create policy "PO access via purchase_orders RLS"
  on public.po_lines for all
  using (
    po_id in (select id from public.purchase_orders where merchant_org_id in (select org_id from public.profiles where id = auth.uid()) or manufacturer_org_id in (select org_id from public.profiles where id = auth.uid()))
  );
