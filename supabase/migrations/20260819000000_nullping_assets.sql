-- NullPing assets: extra site fields, Pinterest pins, page visits

alter table if exists public.sites
  add column if not exists product_name text,
  add column if not exists product_url text,
  add column if not exists asset_source text not null default 'activator';

create table if not exists public.site_pins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete cascade,
  batch_id uuid not null,
  idx smallint not null default 0,
  headline text not null default '',
  title text not null,
  description text not null default '',
  keywords text[] not null default '{}',
  image_url text,
  source_image_url text,
  created_at timestamptz not null default now()
);

alter table if exists public.site_pins
  add column if not exists source_image_url text;

create index if not exists site_pins_user_id_idx on public.site_pins (user_id);
create index if not exists site_pins_site_id_idx on public.site_pins (site_id);
create index if not exists site_pins_batch_id_idx on public.site_pins (batch_id);

alter table public.site_pins enable row level security;

drop policy if exists "own site pins" on public.site_pins;
create policy "own site pins"
  on public.site_pins
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.page_visits (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  pin_id uuid references public.site_pins(id) on delete set null,
  source text,
  country text,
  created_at timestamptz not null default now()
);

create index if not exists page_visits_site_id_idx on public.page_visits (site_id);
create index if not exists page_visits_created_at_idx on public.page_visits (created_at desc);

alter table public.page_visits enable row level security;

drop policy if exists "insert page visits" on public.page_visits;
create policy "insert page visits"
  on public.page_visits
  for insert
  with check (true);

drop policy if exists "own page visits read" on public.page_visits;
create policy "own page visits read"
  on public.page_visits
  for select
  using (
    exists (
      select 1 from public.sites
      where sites.id = page_visits.site_id
        and sites.user_id = auth.uid()
    )
  );

create or replace function public.record_page_visit(
  p_site_id uuid,
  p_pin_id uuid default null,
  p_source text default null,
  p_country text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.sites where id = p_site_id and status = 'live') then
    insert into public.page_visits (site_id, pin_id, source, country)
    values (p_site_id, p_pin_id, p_source, p_country);
  end if;
end;
$$;

grant execute on function public.record_page_visit(uuid, uuid, text, text) to anon, authenticated;
