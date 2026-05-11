# mdicas

Blog em Next.js 14 (App Router) com painel administrativo e autenticação via Supabase.

## Stack

- **Next.js 14** (App Router, Server Components)
- **Supabase** — Auth + Postgres (posts, listas de compras, grupos de ofertas, instagram)
- **TipTap** — editor rich-text no painel admin
- **TypeScript** + Tailwind via `globals.css`

## Estrutura

```
src/
├── app/                    # rotas (App Router)
│   ├── admin/              # painel restrito (Supabase Auth)
│   ├── api/                # route handlers
│   ├── artigo/[slug]/      # detalhe do artigo
│   ├── artigos/            # listagem
│   ├── categoria/[slug]/   # filtro por categoria
│   ├── listas/             # listas de compras
│   └── login/              # login do admin
├── lib/
│   ├── repositories/       # acesso ao Supabase (service_role)
│   ├── supabase/           # client server-side com service role
│   └── security/auth.ts    # withAdminAuth para route handlers
├── utils/supabase/         # client/server (anon key, RLS)
├── components/             # componentes compartilhados
└── middleware.ts           # gate Basic Auth + refresh de sessão
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública (sem barra final). Usada em sitemap, robots, OG, JSON-LD. |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (pública, RLS aplica). |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (servidor apenas, bypassa RLS). |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Token do Google Search Console (opcional). |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Token do Bing Webmaster (opcional). |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | Token do Yandex Webmaster (opcional). |

## Migrações de banco

Os arquivos em `migrations/` precisam ser aplicados manualmente no Supabase
(Dashboard → SQL Editor → cole o conteúdo → Run). Aplique na ordem numérica:

| Arquivo | O que faz |
|---|---|
| `0001_add_post_cover_image.sql` | Adiciona coluna `cover_image_url` em `posts` (imagem de capa opcional do destaque principal). |
| `0002_post_covers_bucket.sql` | Cria o bucket `post-covers` no Storage com leitura pública e policies de escrita restritas a usuários autenticados. |

> Sem `0002`, o upload de capa via admin retornará 500. Sem `0001`, o campo
> aparece no formulário mas não persiste.

## Desenvolvimento

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # verifica tipos
npm run lint         # lint + acessibilidade (jsx-a11y)
npm run lint:a11y    # apenas regras de a11y, modo silencioso
npm test             # testes unitários (DTOs, validadores, sanitizer)
```

## Deploy (Vercel)

1. Importe o repo na Vercel.
2. Em **Settings → Environment Variables**, configure as variáveis acima nos 3 ambientes (Production / Preview / Development).
3. Deploy.

## Build local

```bash
npm run build
npm start
```
