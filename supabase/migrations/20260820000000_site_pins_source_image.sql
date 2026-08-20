-- Run in Supabase SQL Editor (one-time) so pin scrape backgrounds store on each row.
alter table if exists public.site_pins
  add column if not exists source_image_url text;
