-- Public read policies for core tables used by the dashboard.
-- Safe to run multiple times.

-- Livestock
alter table public.livestock enable row level security;
drop policy if exists "Anyone can read livestock" on public.livestock;
create policy "Anyone can read livestock"
  on public.livestock
  for select
  using (true);

-- Vegetation blocks
alter table public.vegetation_blocks enable row level security;
drop policy if exists "Anyone can read vegetation blocks" on public.vegetation_blocks;
create policy "Anyone can read vegetation blocks"
  on public.vegetation_blocks
  for select
  using (true);

-- Transactions
alter table public.transactions enable row level security;
drop policy if exists "Anyone can read transactions" on public.transactions;
create policy "Anyone can read transactions"
  on public.transactions
  for select
  using (true);

-- Vaccination schedule items (in case it wasn't applied yet)
alter table public.vaccination_schedule_items enable row level security;
drop policy if exists "Anyone can read vaccination schedule" on public.vaccination_schedule_items;
create policy "Anyone can read vaccination schedule"
  on public.vaccination_schedule_items
  for select
  using (true);

