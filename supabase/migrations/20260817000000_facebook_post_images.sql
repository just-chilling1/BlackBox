-- Optional visuals for generated Facebook posts.

alter table public.site_facebook_posts
  add column if not exists image_url text;
