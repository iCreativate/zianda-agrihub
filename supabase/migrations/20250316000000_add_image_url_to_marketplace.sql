-- Add optional image URL to marketplace listings.
-- Run after the marketplace_listings table exists.

alter table public.marketplace_listings
  add column if not exists image_url text;
