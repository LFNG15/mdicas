-- 0002_post_covers_bucket.sql
-- Configura o bucket "post-covers" do Supabase Storage com leitura pública
-- e escrita restrita a usuários autenticados (admin).
--
-- Como aplicar:
--   Supabase Dashboard → SQL Editor → cole este arquivo → Run
--
-- Após rodar, confirme em Storage → Buckets que "post-covers" existe e está marcado como público.

-- 1. Cria o bucket se não existir (público para leitura).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-covers',
  'post-covers',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Policies de acesso.
--    Leitura: qualquer pessoa (bucket é público, mas a policy reforça).
--    Escrita/atualização/remoção: apenas authenticated.

drop policy if exists "post-covers: public read" on storage.objects;
create policy "post-covers: public read"
  on storage.objects for select
  using (bucket_id = 'post-covers');

drop policy if exists "post-covers: authenticated write" on storage.objects;
create policy "post-covers: authenticated write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-covers');

drop policy if exists "post-covers: authenticated update" on storage.objects;
create policy "post-covers: authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'post-covers');

drop policy if exists "post-covers: authenticated delete" on storage.objects;
create policy "post-covers: authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-covers');
