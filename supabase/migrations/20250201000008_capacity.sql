-- capacity: manufacturer capacity (units/day, blackout dates)
create table if not exists public.capacity_settings (
  id uuid primary key default gen_random_uuid(),
  manufacturer_org_id uuid not null references public.organizations (id) on delete cascade,
  units_per_day integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (manufacturer_org_id)
);

create table if not exists public.capacity_blackout_dates (
  id uuid primary key default gen_random_uuid(),
  manufacturer_org_id uuid not null references public.organizations (id) on delete cascade,
  date date not null,
  reason text,
  created_at timestamptz not null default now(),
  unique (manufacturer_org_id, date)
);

create index if not exists capacity_blackout_org_date_idx on public.capacity_blackout_dates (manufacturer_org_id, date);

alter table public.capacity_settings enable row level security;
alter table public.capacity_blackout_dates enable row level security;

create policy "Manufacturer org can manage own capacity_settings"
  on public.capacity_settings for all
  using (manufacturer_org_id in (select org_id from public.profiles where id = auth.uid()));

create policy "Manufacturer org can manage own capacity_blackout_dates"
  on public.capacity_blackout_dates for all
  using (manufacturer_org_id in (select org_id from public.profiles where id = auth.uid()));

create trigger capacity_settings_updated_at
  before update on public.capacity_settings
  for each row execute function public.set_updated_at();
