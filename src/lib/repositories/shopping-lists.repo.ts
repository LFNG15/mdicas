import { getServiceClient } from "@/lib/supabase/server-client";
import type {
  ShoppingListInput,
  ShoppingListItemInput,
} from "@/lib/dto/shopping-list.dto";

const LISTS = "shopping_lists";
const ITEMS = "shopping_list_items";

export const ShoppingListsRepo = {
  async list() {
    return getServiceClient()
      .from(LISTS)
      .select("*, items:shopping_list_items(*)")
      .order("created_at", { ascending: false });
  },

  async create(input: ShoppingListInput) {
    return getServiceClient()
      .from(LISTS)
      .insert(input)
      .select()
      .single();
  },

  async remove(id: string) {
    return getServiceClient().from(LISTS).delete().eq("id", id);
  },

  async countItems(listId: string) {
    return getServiceClient()
      .from(ITEMS)
      .select("*", { count: "exact", head: true })
      .eq("list_id", listId);
  },

  async addItem(listId: string, input: ShoppingListItemInput, position: number) {
    return getServiceClient()
      .from(ITEMS)
      .insert({ list_id: listId, ...input, position })
      .select()
      .single();
  },

  async removeItem(listId: string, itemId: string) {
    return getServiceClient()
      .from(ITEMS)
      .delete()
      .eq("id", itemId)
      .eq("list_id", listId);
  },
};
