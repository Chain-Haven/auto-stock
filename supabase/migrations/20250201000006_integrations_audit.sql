-- integrations: encrypted credentials (ShipStation, Mercury, etc.)
create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  provider text not null check (provider in ('shipstation', 'mercury', 'woo')),
  credentials_encrypted text,
  config jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, provider)
);

create index if not exists integrations_org_idx on public.integrations (org_id);

alter table public.integrations enable row level security;

create policy "Org members can manage own integrations"
  on public.integrations for all
  using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create trigger integrations_updated_at
  before update on public.integrations
  for each row execute function public.set_updated_at();

-- negotiated_pricing: per connection + SKU (M5 detail; stub here)
create table if not exists public.negotiated_pricing (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.connections (id) on delete cascade,
  catalog_id uuid references public.catalog (id) on delete set null,
  sku text not null,
  unit_price_cents bigint not null,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists negotiated_pricing_connection_idx on public.negotiated_pricing (connection_id);

alter table public.negotiated_pricing enable row level security;

create policy "Connection parties can read negotiated pricing"
  on public.negotiated_pricing for select
  using (
    connection_id in (
      select id from public.connections
      where merchant_org_id in (select org_id from public.profiles where id = auth.uid())
      or manufacturer_org_id in (select org_id from public.profiles where id = auth.uid())
    )
  );

create policy "Manufacturer can manage negotiated pricing"
  on public.negotiated_pricing for all
  using (
    connection_id in (select id from public.connections where manufacturer_org_id in (select org_id from public.profiles where id = auth.uid()))
  );

-- notifications: in-app
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications (user_id);
create index if not exists notifications_read_idx on public.notifications (read_at);

alter table public.notifications enable row level security;

create policy "Users can read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications (mark read)"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "System can insert notifications"
  on public.notifications for insert
  with check (true);

-- audit_log: generic audit trail
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  row_id uuid,
  action text not null check (action in ('insert', 'update', 'delete')),
  old_data jsonb,
  new_data jsonb,
  actor_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_table_row_idx on public.audit_log (table_name, row_id);
create index if not exists audit_log_created_idx on public.audit_log (created_at desc);

alter table public.audit_log enable row level security;

create policy "Authenticated can read audit log (scoped by app)"
  on public.audit_log for select
  using (auth.role() = 'authenticated');

create policy "Service can insert audit"
  on public.audit_log for insert
  with check (true);
