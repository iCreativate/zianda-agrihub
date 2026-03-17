-- Allow the app to read vaccination_schedule_items.
-- Safe to run multiple times.

alter table public.vaccination_schedule_items
  enable row level security;

drop policy if exists "Anyone can read vaccination schedule" on public.vaccination_schedule_items;

create policy "Anyone can read vaccination schedule"
  on public.vaccination_schedule_items
  for select
  using (true);

