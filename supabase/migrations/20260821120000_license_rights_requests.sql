-- Persist License Rights activation requests (replaces localStorage-only pending state)

create table if not exists public.license_rights_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  message text not null,
  status text not null default 'pending'
    check (status in ('pending', 'activated', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_license_rights_requests_user_id
  on public.license_rights_requests (user_id);

create index if not exists idx_license_rights_requests_user_status
  on public.license_rights_requests (user_id, status);

alter table public.license_rights_requests enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'license_rights_requests'
      and policyname = 'Users can view own license rights requests'
  ) then
    create policy "Users can view own license rights requests"
      on public.license_rights_requests for select
      using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'license_rights_requests'
      and policyname = 'Users can insert own license rights requests'
  ) then
    create policy "Users can insert own license rights requests"
      on public.license_rights_requests for insert
      with check (auth.uid() = user_id);
  end if;
end $$;
