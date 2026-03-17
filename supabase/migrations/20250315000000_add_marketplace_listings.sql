-- Run this migration only if your database already has the main schema (livestock, vegetation, etc.).
-- Safe to run: uses IF NOT EXISTS and DROP POLICY IF EXISTS.

-- Marketplace: listings from all farmers
create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('selling', 'buying')),
  title text not null,
  description text,
  contact text,
  creator_name text,
  created_at timestamptz not null default now()
);

alter table public.marketplace_listings
  enable row level security;

-- Drop policies if they exist (so re-running this migration doesn't error)
drop policy if exists "Anyone can read marketplace listings" on public.marketplace_listings;
drop policy if exists "Anyone can insert marketplace listings" on public.marketplace_listings;
drop policy if exists "Anyone can update marketplace listings" on public.marketplace_listings;
drop policy if exists "Anyone can delete marketplace listings" on public.marketplace_listings;

create policy "Anyone can read marketplace listings"
  on public.marketplace_listings for select
  using (true);

create policy "Anyone can insert marketplace listings"
  on public.marketplace_listings for insert
  with check (true);

create policy "Anyone can update marketplace listings"
  on public.marketplace_listings for update
  using (true);

create policy "Anyone can delete marketplace listings"
  on public.marketplace_listings for delete
  using (true);
