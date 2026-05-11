import { getPublicClient } from "./public-client";
import { rowToPost, type Post, type PostRow } from "./types";

export async function getAllPosts(): Promise<Post[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as PostRow[]).map(rowToPost);
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as PostRow[]).map(rowToPost);
}

export async function getBlogPosts(): Promise<Post[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("featured_main", false)
    .order("created_at", { ascending: false })
    .limit(3);
  if (error) throw new Error(error.message);
  return (data as PostRow[]).map(rowToPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return rowToPost(data as PostRow);
}

export async function getAllSlugs(): Promise<{ slug: string }[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase.from("posts").select("slug");
  if (error) throw new Error(error.message);
  return data as { slug: string }[];
}

export async function getTotalPostCount(): Promise<number> {
  const supabase = getPublicClient();
  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

export async function getShoppingLists() {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("shopping_lists")
    .select("*, items:shopping_list_items(*)")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data as any[];
}

export async function getGruposOfertas(): Promise<{ id: string; platform: string; name: string; url: string }[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("grupos_ofertas")
    .select("id, platform, name, url")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data as any[];
}

export async function getInstagramPosts(): Promise<{ id: string; url: string; image_url: string; caption: string; created_at: string }[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("instagram_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);
  if (error) return [];
  return data as any[];
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as PostRow[]).map(rowToPost);
}

export async function getDistinctCategories(): Promise<string[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase.from("posts").select("category");
  if (error) return [];
  const set = new Set<string>();
  for (const row of data as { category: string }[]) {
    if (row.category) set.add(row.category);
  }
  return Array.from(set);
}

export async function getCategoryCounts(): Promise<{ name: string; count: number }[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase.from("posts").select("category");
  if (error) return [];

  const counts: Record<string, number> = {};
  for (const row of data as { category: string }[]) {
    if (!row.category) continue;
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  }

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
