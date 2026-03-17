create type livestock_species as enum (
  'cattle',
  'goat',
  'sheep',
  'poultry',
  'pig',
  'dog',
  'other'
);

create type crop_type as enum (
  'maize',
  'wheat',
  'soybean',
  'vegetable',
  'fruit',
  'forage',
  'other'
);

create type transaction_category as enum (
  'feed',
  'labor',
  'medical',
  'fertilizer',
  'pesticide',
  'equipment',
  'other'
);

create type content_category as enum (
  'latest-trends',
  'farmer-education'
);

create type asset_type as enum (
  'livestock',
  'vegetation'
);

create table public.livestock (
  id uuid primary key default gen_random_uuid(),
  external_id text unique not null,
  name text not null,
  species livestock_species not null,
  breed text,
  date_of_birth date,
  weight_kg numeric,
  qr_code text unique,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.livestock_lineage (
  id uuid primary key default gen_random_uuid(),
  livestock_id uuid not null references public.livestock (id) on delete cascade,
  parent_id uuid not null references public.livestock (id) on delete restrict,
  relationship text not null check (relationship in ('sire', 'dam'))
);

create table public.vaccination_records (
  id uuid primary key default gen_random_uuid(),
  livestock_id uuid not null references public.livestock (id) on delete cascade,
  vaccine_name text not null,
  scheduled_date date not null,
  administered_date date,
  veterinarian text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.vegetation_blocks (
  id uuid primary key default gen_random_uuid(),
  external_id text unique not null,
  crop_type crop_type not null,
  variety text,
  planting_date date not null,
  area_hectares numeric,
  qr_code text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.soil_logs (
  id uuid primary key default gen_random_uuid(),
  vegetation_block_id uuid not null references public.vegetation_blocks (id) on delete cascade,
  logged_at timestamptz not null default now(),
  ph numeric,
  moisture_percent numeric,
  notes text
);

create table public.input_schedule_items (
  id uuid primary key default gen_random_uuid(),
  vegetation_block_id uuid not null references public.vegetation_blocks (id) on delete cascade,
  type text not null check (type in ('fertilizer', 'pesticide', 'herbicide')),
  product_name text not null,
  dosage text,
  scheduled_date date not null,
  applied_date date,
  notes text
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  amount numeric not null,
  currency text not null default 'USD',
  category transaction_category not null,
  description text,
  livestock_id uuid references public.livestock (id) on delete set null,
  vegetation_block_id uuid references public.vegetation_blocks (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.education_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category content_category not null,
  body_markdown text not null,
  author text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.health_timeline_photos (
  id uuid primary key default gen_random_uuid(),
  asset_type asset_type not null,
  asset_id uuid not null,
  captured_at timestamptz not null default now(),
  photo_url text not null,
  notes text
);

create table public.vaccination_schedule_items (
  id uuid primary key default gen_random_uuid(),
  livestock_id uuid not null references public.livestock (id) on delete cascade,
  vaccine_name text not null,
  recommended_age_days integer not null,
  scheduled_date date not null,
  completed boolean not null default false
);

alter table public.livestock
  enable row level security;

alter table public.vegetation_blocks
  enable row level security;

alter table public.transactions
  enable row level security;

alter table public.education_content
  enable row level security;

alter table public.health_timeline_photos
  enable row level security;

alter table public.vaccination_records
  enable row level security;

alter table public.vaccination_schedule_items
  enable row level security;

alter table public.soil_logs
  enable row level security;

alter table public.input_schedule_items
  enable row level security;

-- Marketplace: listings from all farmers (anyone can read; insert allowed for anon/auth)
create table public.marketplace_listings (
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

