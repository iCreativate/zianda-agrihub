-- Create a public storage bucket for item images (marketplace, equipment, vehicles, tools, seeds).
-- Run this in the Supabase SQL editor or via migrations. Requires storage schema to exist.

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

-- Drop existing policies if re-running
drop policy if exists "Public read for uploads bucket" on storage.objects;
drop policy if exists "Public insert for uploads bucket" on storage.objects;
drop policy if exists "Public update for uploads bucket" on storage.objects;
drop policy if exists "Public delete for uploads bucket" on storage.objects;

-- Allow public read access to files in the uploads bucket
create policy "Public read for uploads bucket"
  on storage.objects for select
  using (bucket_id = 'uploads');

-- Allow anyone to upload (anon/auth) for the uploads bucket
create policy "Public insert for uploads bucket"
  on storage.objects for insert
  with check (bucket_id = 'uploads');

-- Allow update/delete for uploads bucket (e.g. when editing listing images)
create policy "Public update for uploads bucket"
  on storage.objects for update
  using (bucket_id = 'uploads');

create policy "Public delete for uploads bucket"
  on storage.objects for delete
  using (bucket_id = 'uploads');
