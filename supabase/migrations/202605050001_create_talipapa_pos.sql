create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  emoji text not null,
  color_hex text not null,
  sort_order int not null default 0
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text not null default '',
  unit text not null check (unit in ('kg','pc','bundle','tali','dozen','liter')),
  price numeric not null check (price >= 0),
  stock_qty numeric not null default 0,
  low_stock_threshold numeric not null default 5,
  image_url text,
  barcode text unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  stall_no text not null,
  contact text,
  specialization text
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  txn_no text not null unique,
  cashier_id uuid references auth.users(id),
  subtotal numeric not null,
  discount_amount numeric not null default 0,
  discount_type text,
  total numeric not null,
  amount_tendered numeric not null,
  change_amount numeric not null,
  payment_method text not null check (payment_method in ('cash','utang')),
  status text not null default 'completed',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit text not null,
  qty numeric not null check (qty > 0),
  unit_price numeric not null,
  subtotal numeric not null
);

create table if not exists public.discounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('percent','fixed')),
  value numeric not null,
  is_active boolean not null default true
);

create table if not exists public.daily_summary (
  id uuid primary key default gen_random_uuid(),
  report_date date not null unique,
  gross_sales numeric not null default 0,
  net_sales numeric not null default 0,
  total_transactions int not null default 0,
  total_items_sold numeric not null default 0,
  top_product_id uuid references public.products(id)
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.vendors enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_items enable row level security;
alter table public.discounts enable row level security;
alter table public.daily_summary enable row level security;

create policy "authenticated full access categories" on public.categories for all to authenticated using (true) with check (true);
create policy "authenticated full access products" on public.products for all to authenticated using (true) with check (true);
create policy "authenticated full access vendors" on public.vendors for all to authenticated using (true) with check (true);
create policy "authenticated full access transactions" on public.transactions for all to authenticated using (true) with check (true);
create policy "authenticated full access transaction_items" on public.transaction_items for all to authenticated using (true) with check (true);
create policy "authenticated full access discounts" on public.discounts for all to authenticated using (true) with check (true);
create policy "authenticated full access daily_summary" on public.daily_summary for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "authenticated can read product images"
on storage.objects for select
to authenticated
using (bucket_id = 'product-images');

create policy "authenticated can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

create policy "authenticated can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

create policy "authenticated can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
