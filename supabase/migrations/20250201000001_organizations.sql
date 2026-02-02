-- organizations: merchant or manufacturer org (replaces separate merchants/manufacturers for simplicity)
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('merchant', 'manufacturer')),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizations_type_idx on public.organizations (type);

alter table public.organizations enable row level security;

-- RLS: users can read orgs they belong to (via profile.org_id)
create policy "Users can read own org"
  on public.organizations for select
  using (
    id in (select org_id from public.profiles where id = auth.uid() and org_id is not null)
  );

-- Only allow insert/update via service or own org (we'll restrict in app; for RLS allow same-org)
create policy "Users can update own org"
  on public.organizations for update
  using (
    id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Users can insert org"
  on public.organizations for insert
  with check (true);

-- FK profiles.org_id -> organizations (only if not already present)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_org_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_org_id_fkey
      foreign key (org_id) references public.organizations (id) on delete set null;
  end if;
end $$;

create trigger organizations_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();
