-- 0001_add_post_cover_image.sql
-- Adiciona suporte a imagem de capa nos artigos.
--
-- Como aplicar:
--   Supabase Dashboard → SQL Editor → cole este arquivo → Run
--   ou via CLI: supabase db execute -f migrations/0001_add_post_cover_image.sql

alter table public.posts
  add column if not exists cover_image_url text;

comment on column public.posts.cover_image_url is
  'URL pública da imagem de capa exibida no destaque principal. NULL = usa o gradiente do campo gradient.';
