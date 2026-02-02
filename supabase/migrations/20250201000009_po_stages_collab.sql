-- manufacturing_stages: per PO (capacity-aware ETA)
create table if not exists public.manufacturing_stages (
  id uuid primary key default gen_random_uuid(),
  po_id uuid not null references public.purchase_orders (id) on delete cascade,
  stage text not null check (stage in ('quoted', 'confirmed', 'in_production', 'qc', 'ready_to_ship', 'shipped')),
  eta timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists manufacturing_stages_po_idx on public.manufacturing_stages (po_id);

alter table public.manufacturing_stages enable row level security;

create policy "Read stages via PO"
  on public.manufacturing_stages for select
  using (
    po_id in (select id from public.purchase_orders where merchant_org_id in (select org_id from public.profiles where id = auth.uid()) or manufacturer_org_id in (select org_id from public.profiles where id = auth.uid()))
  );

create policy "Manufacturer can insert/update stages"
  on public.manufacturing_stages for all
  using (
    po_id in (select id from public.purchase_orders where manufacturer_org_id in (select org_id from public.profiles where id = auth.uid()))
  );

-- collaboration_feed: comments + system events (shared, RLS)
create table if not exists public.collaboration_feed (
  id uuid primary key default gen_random_uuid(),
  po_id uuid references public.purchase_orders (id) on delete cascade,
  quote_id uuid references public.quotes (id) on delete set null,
  author_id uuid references auth.users (id) on delete set null,
  type text not null check (type in ('comment', 'system')),
  body text,
  created_at timestamptz not null default now()
);

create index if not exists collaboration_feed_po_idx on public.collaboration_feed (po_id);
create index if not exists collaboration_feed_quote_idx on public.collaboration_feed (quote_id);

alter table public.collaboration_feed enable row level security;

create policy "Read feed via PO or quote org"
  on public.collaboration_feed for select
  using (
    (po_id is not null and po_id in (select id from public.purchase_orders where merchant_org_id in (select org_id from public.profiles where id = auth.uid()) or manufacturer_org_id in (select org_id from public.profiles where id = auth.uid())))
    or (quote_id is not null and quote_id in (select id from public.quotes where merchant_org_id in (select org_id from public.profiles where id = auth.uid()) or manufacturer_org_id in (select org_id from public.profiles where id = auth.uid())))
  );

create policy "Insert comment as authenticated"
  on public.collaboration_feed for insert
  with check (auth.uid() = author_id or author_id is null);
create policy "Update own comment"
  on public.collaboration_feed for update
  using (auth.uid() = author_id);
