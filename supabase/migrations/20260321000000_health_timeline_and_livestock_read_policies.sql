-- Allow the app to read and write visual health timelines (same access model as marketplace).

alter table public.health_timeline_photos enable row level security;

drop policy if exists "Anyone can read health timeline photos" on public.health_timeline_photos;
create policy "Anyone can read health timeline photos"
  on public.health_timeline_photos
  for select
  using (true);

drop policy if exists "Anyone can insert health timeline photos" on public.health_timeline_photos;
create policy "Anyone can insert health timeline photos"
  on public.health_timeline_photos
  for insert
  with check (true);

drop policy if exists "Anyone can update health timeline photos" on public.health_timeline_photos;
create policy "Anyone can update health timeline photos"
  on public.health_timeline_photos
  for update
  using (true);

drop policy if exists "Anyone can delete health timeline photos" on public.health_timeline_photos;
create policy "Anyone can delete health timeline photos"
  on public.health_timeline_photos
  for delete
  using (true);

-- Vaccination history records used on animal profiles
alter table public.vaccination_records enable row level security;

drop policy if exists "Anyone can read vaccination records" on public.vaccination_records;
create policy "Anyone can read vaccination records"
  on public.vaccination_records
  for select
  using (true);

drop policy if exists "Anyone can insert vaccination records" on public.vaccination_records;
create policy "Anyone can insert vaccination records"
  on public.vaccination_records
  for insert
  with check (true);

-- Lineage used on animal profiles
alter table public.livestock_lineage enable row level security;

drop policy if exists "Anyone can read livestock lineage" on public.livestock_lineage;
create policy "Anyone can read livestock lineage"
  on public.livestock_lineage
  for select
  using (true);
