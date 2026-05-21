-- Bahria University Campus Notice Board
-- Run this file in Supabase SQL Editor before using the React app.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz default now()
);

create table if not exists public.notices (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  category text not null check (category in ('Academic', 'Event', 'Urgent', 'General')),
  created_at timestamptz default now()
);

create index if not exists notices_created_at_idx
  on public.notices (created_at desc);

create index if not exists notices_category_idx
  on public.notices (category);

alter table public.profiles enable row level security;
alter table public.notices enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Everyone can read notices" on public.notices;
create policy "Everyone can read notices"
on public.notices
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can create own notices" on public.notices;
create policy "Authenticated users can create own notices"
on public.notices
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own notices" on public.notices;
create policy "Users can delete own notices"
on public.notices
for delete
to authenticated
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable Supabase Realtime for notice changes.
alter publication supabase_realtime add table public.notices;
