-- Allow vaccination_schedule_items to link either to livestock or to a crop block.
-- This migration is safe to run multiple times.

alter table public.vaccination_schedule_items
  add column if not exists vegetation_block_id uuid references public.vegetation_blocks (id) on delete cascade;

