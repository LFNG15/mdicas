import { createClient } from "@supabase/supabase-js";

// Cria o cliente sob demanda para não falhar durante o build
// quando SUPABASE_SERVICE_ROLE_KEY ainda não está definida
export function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
