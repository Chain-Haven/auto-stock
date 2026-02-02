-- jobs: background job runs (stub for ops health)
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists jobs_name_created_idx on public.jobs (name, created_at desc);

alter table public.jobs enable row level security;

-- Only service role or admin can read jobs; for app we allow authenticated read (admin page protected by route)
create policy "Authenticated users can read jobs"
  on public.jobs for select
  using (auth.role() = 'authenticated');

create policy "Service can manage jobs"
  on public.jobs for all
  using (auth.role() = 'service_role');

-- shipments: per PO (ShipStation)
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  po_id uuid not null references public.purchase_orders (id) on delete restrict,
  carrier text,
  tracking_number text,
  status text not null default 'pending' check (status in ('pending', 'label_created', 'shipped', 'delivered', 'returned')),
  shipped_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shipments_po_idx on public.shipments (po_id);

alter table public.shipments enable row level security;

create policy "Merchant or manufacturer org can read shipments via PO"
  on public.shipments for select
  using (
    po_id in (select id from public.purchase_orders where merchant_org_id in (select org_id from public.profiles where id = auth.uid()) or manufacturer_org_id in (select org_id from public.profiles where id = auth.uid()))
  );

create policy "Manufacturer can insert/update shipments"
  on public.shipments for all
  using (
    po_id in (select id from public.purchase_orders where manufacturer_org_id in (select org_id from public.profiles where id = auth.uid()))
  );

create trigger shipments_updated_at
  before update on public.shipments
  for each row execute function public.set_updated_at();

-- invoices: Mercury / billing
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  po_id uuid references public.purchase_orders (id) on delete set null,
  external_id text,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  total_cents bigint,
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invoices_po_idx on public.invoices (po_id);
create index if not exists invoices_external_idx on public.invoices (external_id);

alter table public.invoices enable row level security;

create policy "Read invoices via PO org"
  on public.invoices for select
  using (
    po_id is null or po_id in (select id from public.purchase_orders where merchant_org_id in (select org_id from public.profiles where id = auth.uid()) or manufacturer_org_id in (select org_id from public.profiles where id = auth.uid()))
  );

create policy "Service can manage invoices"
  on public.invoices for all
  using (auth.role() = 'service_role');

create trigger invoices_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();
