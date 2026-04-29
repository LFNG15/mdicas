import { getServiceClient } from "@/lib/supabase/server-client";
import type { GrupoOfertaInput } from "@/lib/dto/grupos-ofertas.dto";

const TABLE = "grupos_ofertas";

export const GruposOfertasRepo = {
  async listActive() {
    return getServiceClient()
      .from(TABLE)
      .select("id, platform, name, url")
      .eq("active", true)
      .order("created_at", { ascending: false });
  },

  async create(input: GrupoOfertaInput) {
    return getServiceClient()
      .from(TABLE)
      .insert(input)
      .select()
      .single();
  },

  async remove(id: string) {
    return getServiceClient().from(TABLE).delete().eq("id", id);
  },
};
