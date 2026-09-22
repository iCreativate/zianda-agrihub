-- Cover photo for crop fields (matches livestock.photo_url pattern).
alter table public.vegetation_blocks
  add column if not exists photo_url text;

-- Soil logs & input schedules used on field detail.
alter table public.soil_logs enable row level security;
drop policy if exists "Anyone can read soil logs" on public.soil_logs;
create policy "Anyone can read soil logs"
  on public.soil_logs for select using (true);
drop policy if exists "Anyone can insert soil logs" on public.soil_logs;
create policy "Anyone can insert soil logs"
  on public.soil_logs for insert with check (true);
drop policy if exists "Anyone can update soil logs" on public.soil_logs;
create policy "Anyone can update soil logs"
  on public.soil_logs for update using (true);
drop policy if exists "Anyone can delete soil logs" on public.soil_logs;
create policy "Anyone can delete soil logs"
  on public.soil_logs for delete using (true);

alter table public.input_schedule_items enable row level security;
drop policy if exists "Anyone can read input schedule" on public.input_schedule_items;
create policy "Anyone can read input schedule"
  on public.input_schedule_items for select using (true);
drop policy if exists "Anyone can insert input schedule" on public.input_schedule_items;
create policy "Anyone can insert input schedule"
  on public.input_schedule_items for insert with check (true);
drop policy if exists "Anyone can update input schedule" on public.input_schedule_items;
create policy "Anyone can update input schedule"
  on public.input_schedule_items for update using (true);
drop policy if exists "Anyone can delete input schedule" on public.input_schedule_items;
create policy "Anyone can delete input schedule"
  on public.input_schedule_items for delete using (true);
