import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";
import { getAllPosts, getDistinctCategories } from "@/lib/supabase/queries";
import { categoryToSlug } from "@/lib/seo/slug";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE.url}/artigos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/listas`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/politica-de-privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];

  let postUrls: MetadataRoute.Sitemap = [];
  let categoryUrls: MetadataRoute.Sitemap = [];
  try {
    const [posts, categories] = await Promise.all([
      getAllPosts(),
      getDistinctCategories(),
    ]);
    postUrls = posts.map((p) => ({
      url: `${SITE.url}/artigo/${p.slug}`,
      lastModified: /^\d{4}-\d{2}-\d{2}/.test(p.date) ? new Date(p.date) : undefined,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
    categoryUrls = categories.map((c) => ({
      url: `${SITE.url}/categoria/${categoryToSlug(c)}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // Em caso de falha de DB durante build, segue com URLs estáticas.
  }

  return [...staticUrls, ...categoryUrls, ...postUrls];
}
