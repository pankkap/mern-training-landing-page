-- Supabase schema for MERNStack frontend-only flow
-- Run this SQL in Supabase SQL editor.

create extension if not exists pgcrypto;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('admin', 'student')),
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  amount numeric(10,2) not null default 7500,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  payment_review_status text not null default 'pending' check (payment_review_status in ('pending', 'checked')),
  razorpay_payment_id text,
  razorpay_order_id text,
  razorpay_signature text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_registrations_updated_at on public.registrations;
create trigger trg_registrations_updated_at
before update on public.registrations
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.registrations enable row level security;

-- Anyone can create a registration from the payment form.
drop policy if exists registrations_insert_anon on public.registrations;
create policy registrations_insert_anon
on public.registrations
for insert
to anon, authenticated
with check (true);

-- Anyone can update pending registration with payment details from frontend flow.
drop policy if exists registrations_update_anon on public.registrations;
create policy registrations_update_anon
on public.registrations
for update
to anon, authenticated
using (payment_status = 'pending')
with check (payment_status in ('pending', 'paid', 'failed'));

-- Admin can read all registrations.
drop policy if exists registrations_select_admin on public.registrations;
create policy registrations_select_admin
on public.registrations
for select
to authenticated
using (public.is_admin());

-- Admin can update/delete registrations.
drop policy if exists registrations_update_admin on public.registrations;
create policy registrations_update_admin
on public.registrations
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists registrations_delete_admin on public.registrations;
create policy registrations_delete_admin
on public.registrations
for delete
to authenticated
using (public.is_admin());

-- Profile policies: users can read/update only their own profile row.
drop policy if exists profiles_select_admin on public.profiles;
drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists profiles_upsert_self on public.profiles;
create policy profiles_upsert_self
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Create first admin manually after signup:
-- insert into public.profiles (id, role, full_name)
-- values ('<auth_user_uuid>', 'admin', 'Admin User')
-- on conflict (id) do update set role = 'admin';

-- If registrations table already exists, run this too:
-- alter table public.registrations
-- add column if not exists payment_review_status text not null default 'pending'
-- check (payment_review_status in ('pending', 'checked'));
