import { getServiceClient } from "@/lib/supabase/server-client";
import type { InstagramPostInput } from "@/lib/dto/instagram.dto";

const TABLE = "instagram_posts";
const PUBLIC_LIMIT = 24;

export const InstagramRepo = {
  async list() {
    return getServiceClient()
      .from(TABLE)
      .select("id, url, image_url, caption, created_at")
      .order("created_at", { ascending: false })
      .limit(PUBLIC_LIMIT);
  },

  async create(input: InstagramPostInput) {
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
