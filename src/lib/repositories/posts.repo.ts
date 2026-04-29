import { getServiceClient } from "@/lib/supabase/server-client";
import { postToRow, type Post } from "@/lib/supabase/types";

const TABLE = "posts";

export const PostsRepo = {
  async upsert(post: Post) {
    return getServiceClient()
      .from(TABLE)
      .upsert(postToRow(post), { onConflict: "slug" });
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
