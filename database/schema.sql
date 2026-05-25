-- ─────────────────────────────────────────────────────────────
-- AR-Visualizer · Supabase schema
-- Run inside the Supabase SQL editor.
-- Creates tables, indexes, RLS policies, and the storage bucket.
-- ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ─── USERS ──────────────────────────────────────────────────
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  name          text not null,
  password_hash text not null,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (lower(email));

-- ─── UPLOADED ASSETS ────────────────────────────────────────
create table if not exists public.uploaded_assets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  name          text not null,
  mime_type     text not null,
  size_bytes    bigint not null,
  storage_path  text not null,
  preview_url   text not null,
  status        text not null default 'processing'
                  check (status in ('processing', 'ready', 'failed')),
  metadata      jsonb default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists uploaded_assets_user_idx on public.uploaded_assets (user_id, created_at desc);

-- ─── AR SESSIONS ────────────────────────────────────────────
create table if not exists public.ar_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  device      text,
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  meta        jsonb default '{}'::jsonb
);

create index if not exists ar_sessions_user_idx on public.ar_sessions (user_id, started_at desc);

-- ─── SAVED SCENES ───────────────────────────────────────────
create table if not exists public.saved_scenes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  name          text not null,
  thumbnail_url text,
  objects       jsonb not null default '[]'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists saved_scenes_user_idx on public.saved_scenes (user_id, updated_at desc);

-- ─── ACTIVITY LOGS ──────────────────────────────────────────
create table if not exists public.activity_logs (
  id          bigserial primary key,
  user_id     uuid references public.users(id) on delete set null,
  action      text not null,
  target_type text,
  target_id   uuid,
  meta        jsonb default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists activity_logs_user_idx on public.activity_logs (user_id, created_at desc);

-- ─── SUBSCRIPTIONS ──────────────────────────────────────────
create table if not exists public.subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references public.users(id) on delete cascade,
  plan        text not null default 'atelier' check (plan in ('atelier', 'studio', 'enterprise')),
  status      text not null default 'active' check (status in ('active', 'past_due', 'canceled')),
  renews_at   timestamptz,
  created_at  timestamptz not null default now()
);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
  before update on public.users
  for each row execute procedure public.touch_updated_at();

drop trigger if exists trg_scenes_updated_at on public.saved_scenes;
create trigger trg_scenes_updated_at
  before update on public.saved_scenes
  for each row execute procedure public.touch_updated_at();

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────
alter table public.users           enable row level security;
alter table public.uploaded_assets enable row level security;
alter table public.ar_sessions     enable row level security;
alter table public.saved_scenes    enable row level security;
alter table public.activity_logs   enable row level security;
alter table public.subscriptions   enable row level security;

-- NOTE: This project uses a custom JWT-issuing backend that operates with the
-- Supabase service_role key, which BYPASSES RLS. The policies below provide a
-- safe default for clients that connect directly with the anon key using
-- Supabase Auth — `auth.uid()` must equal the row's `user_id`/`id`.

drop policy if exists "users self read"   on public.users;
drop policy if exists "users self write"  on public.users;
create policy "users self read"  on public.users for select using (auth.uid() = id);
create policy "users self write" on public.users for update using (auth.uid() = id);

drop policy if exists "assets owner all" on public.uploaded_assets;
create policy "assets owner all"
  on public.uploaded_assets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "scenes owner all" on public.saved_scenes;
create policy "scenes owner all"
  on public.saved_scenes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "sessions owner all" on public.ar_sessions;
create policy "sessions owner all"
  on public.ar_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "logs owner read" on public.activity_logs;
create policy "logs owner read"
  on public.activity_logs for select
  using (auth.uid() = user_id);

drop policy if exists "subs owner read" on public.subscriptions;
create policy "subs owner read"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ─── STORAGE BUCKET ─────────────────────────────────────────
-- Public bucket for AR asset previews. Adjust to private if you prefer
-- signed URLs.
insert into storage.buckets (id, name, public)
values ('ar-assets', 'ar-assets', true)
on conflict (id) do nothing;

-- Scope storage objects to their owner-prefixed folder (`<user_id>/...`).
drop policy if exists "asset folder read"   on storage.objects;
drop policy if exists "asset folder write"  on storage.objects;
drop policy if exists "asset folder delete" on storage.objects;

create policy "asset folder read"
  on storage.objects for select
  using (bucket_id = 'ar-assets');

create policy "asset folder write"
  on storage.objects for insert
  with check (
    bucket_id = 'ar-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "asset folder delete"
  on storage.objects for delete
  using (
    bucket_id = 'ar-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
