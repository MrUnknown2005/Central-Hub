-- Central Hub — Supabase schema
--
-- Run this once: Supabase Dashboard → SQL Editor → New query → paste all of it → Run.
-- Safe to re-run (uses "if not exists" / "drop policy if exists" throughout).
--
-- Model: the site is PUBLIC to browse. Only admins sign in, and admins are the
-- only accounts that exist (there is no public sign-up). Creating an account in
-- Supabase is what grants access — a new account becomes an admin automatically
-- (profiles.role defaults to 'admin'). Writes to projects and to storage are
-- gated by is_admin(); public/anon visitors can only read.

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user, carries the role.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  role text not null default 'admin' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A signed-in user may read their own profile (so the app can read its own role).
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- No insert/update/delete policies exist on purpose: the app never writes here.
-- The trigger below (security definer) creates the row; you change a role from
-- the SQL editor, which bypasses RLS. A user can therefore never self-promote.

-- Create a profile automatically whenever an auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role-check helper. security definer + stable so project/storage policies can
-- call it without recursing into profiles' own RLS.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- projects: the hub's tools. Public read; admins write.
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  category text not null default 'web'
    check (category in ('web', 'mobile', 'cli', 'bot', 'api', 'ai', 'game', 'tool')),
  status text not null default 'live'
    check (status in ('live', 'beta', 'wip', 'archived')),
  tech text[] not null default '{}',
  links jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Public, unauthenticated read — the whole hub is browsable by everyone.
drop policy if exists "projects_select_public" on public.projects;
create policy "projects_select_public"
  on public.projects for select
  to anon, authenticated
  using (true);

-- Only admins can add / change / remove projects.
drop policy if exists "projects_insert_admin" on public.projects;
create policy "projects_insert_admin"
  on public.projects for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "projects_update_admin" on public.projects;
create policy "projects_update_admin"
  on public.projects for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "projects_delete_admin" on public.projects;
create policy "projects_delete_admin"
  on public.projects for delete
  to authenticated
  using (public.is_admin());

-- Slugify name → slug on insert, de-duping against existing slugs (name, name-2, …).
create or replace function public.projects_set_slug()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base text;
  candidate text;
  n int := 2;
begin
  -- Respect a slug the caller supplied explicitly.
  if new.slug is not null and length(trim(new.slug)) > 0 then
    return new;
  end if;

  base := regexp_replace(lower(trim(coalesce(new.name, ''))), '[^a-z0-9]+', '-', 'g');
  base := trim(both '-' from base);
  if base = '' then
    base := 'project';
  end if;

  candidate := base;
  while exists (select 1 from public.projects where slug = candidate) loop
    candidate := base || '-' || n;
    n := n + 1;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

drop trigger if exists projects_set_slug on public.projects;
create trigger projects_set_slug
  before insert on public.projects
  for each row execute function public.projects_set_slug();

-- Touch updated_at on every update.
create or replace function public.projects_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.projects_set_updated_at();

-- Keep the newest-first list fast.
create index if not exists projects_updated_at_idx on public.projects (updated_at desc);

-- ---------------------------------------------------------------------------
-- Storage: PNG logos for projects. Public read, admin write.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "project_images_read" on storage.objects;
create policy "project_images_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-images');

drop policy if exists "project_images_insert_admin" on storage.objects;
create policy "project_images_insert_admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "project_images_update_admin" on storage.objects;
create policy "project_images_update_admin"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin())
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "project_images_delete_admin" on storage.objects;
create policy "project_images_delete_admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin());
