-- Extended marketplace listing fields for category, pricing, location and trust.

alter table public.marketplace_listings
  add column if not exists category text default 'other',
  add column if not exists price_amount numeric,
  add column if not exists price_currency text default 'ZAR',
  add column if not exists location text,
  add column if not exists condition text,
  add column if not exists seller_type text default 'farmer',
  add column if not exists quantity text,
  add column if not exists verified boolean default false;

alter table public.marketplace_listings
  drop constraint if exists marketplace_listings_category_check;

alter table public.marketplace_listings
  add constraint marketplace_listings_category_check
  check (category in ('livestock', 'crops', 'produce', 'equipment', 'seeds', 'feed', 'other'));

alter table public.marketplace_listings
  drop constraint if exists marketplace_listings_seller_type_check;

alter table public.marketplace_listings
  add constraint marketplace_listings_seller_type_check
  check (seller_type in ('farmer', 'organisation'));
