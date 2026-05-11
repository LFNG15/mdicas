import { getServiceClient } from "@/lib/supabase/server-client";
import { postToRow, type Post } from "@/lib/supabase/types";

const TABLE = "posts";

export const PostsRepo = {
  async list() {
    return getServiceClient()
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
  },

  async create(post: Post) {
    return getServiceClient()
      .from(TABLE)
      .insert(postToRow(post))
      .select()
      .single();
  },

  async findBySlug(slug: string) {
    return getServiceClient()
      .from(TABLE)
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
  },

  async update(id: string, post: Post) {
    return getServiceClient()
      .from(TABLE)
      .update(postToRow(post))
      .eq("id", id);
  },

  async remove(id: string) {
    return getServiceClient().from(TABLE).delete().eq("id", id);
  },
};
