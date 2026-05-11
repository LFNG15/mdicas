import { createClient } from "@supabase/supabase-js";

// Cliente para leituras públicas em Server Components e funções de build
// (generateStaticParams, sitemap, revalidação). NÃO usa cookies — pode ser
// chamado em qualquer contexto, inclusive sem request scope.
//
// Use este cliente para qualquer query que não dependa do usuário autenticado.
// Para auth (admin), continue usando @/utils/supabase/server.
export function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
