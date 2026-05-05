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
| `BASIC_AUTH_SECRET` | Ativa o gate de acesso restrito. Em branco = site público. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Token do Google Search Console (opcional). |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Token do Bing Webmaster (opcional). |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | Token do Yandex Webmaster (opcional). |

## Acesso restrito por Basic Auth

Quando `BASIC_AUTH_SECRET` está definido, o site inteiro fica atrás de um popup de Basic Auth do navegador. As credenciais são validadas contra os usuários do **Supabase Auth** — basta cadastrar o e-mail/senha do tester em Authentication → Users.

- Após o primeiro login válido, o middleware emite um cookie HMAC-SHA256 (`bauth`) com TTL de 8h, evitando uma chamada ao Supabase por request.
- Para liberar o site ao público: apague o valor de `BASIC_AUTH_SECRET` no provedor (Vercel etc.) e refaça o deploy. Sem mudança de código.
- Para invalidar todos os acessos: troque o `BASIC_AUTH_SECRET` — todos os cookies emitidos viram inválidos imediatamente.

Gerar um secret forte:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Desenvolvimento

```bash
npm install
npm run dev          # http://localhost:3000
```

## Deploy (Vercel)

1. Importe o repo na Vercel.
2. Em **Settings → Environment Variables**, configure as variáveis acima nos 3 ambientes (Production / Preview / Development).
3. Use o mesmo `BASIC_AUTH_SECRET` em todos os ambientes — caso contrário cookies emitidos no preview não funcionam em produção.
4. Deploy.

## Build local

```bash
npm run build
npm start
```
