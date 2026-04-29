import { sanitizeHtml } from "@/lib/security/sanitize";
import { asTrimmedString, isValidSlug, asBool } from "@/lib/security/validators";

export interface PostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tag: string;
  author: string;
  date: string;
  readTime: string;
  gradient: string;
  featured: boolean;
  featuredMain: boolean;
}

export type PostParseResult =
  | { ok: true; value: PostInput }
  | { ok: false; error: string };

export function parsePostInput(raw: unknown): PostParseResult {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Payload inválido" };
  const r = raw as Record<string, unknown>;

  const slug = typeof r.slug === "string" ? r.slug.trim() : "";
  if (!isValidSlug(slug)) return { ok: false, error: "Slug inválido" };

  const title = asTrimmedString(r.title, 300);
  if (!title) return { ok: false, error: "Título inválido" };

  const excerpt = asTrimmedString(r.excerpt, 1000);
  if (!excerpt) return { ok: false, error: "Resumo inválido" };

  if (typeof r.content !== "string" || r.content.length > 200_000) {
    return { ok: false, error: "Conteúdo inválido" };
  }

  const category = asTrimmedString(r.category, 80);
  if (!category) return { ok: false, error: "Categoria inválida" };

  const tag = asTrimmedString(r.tag, 80);
  if (!tag) return { ok: false, error: "Tag inválida" };

  const author = asTrimmedString(r.author, 120);
  if (!author) return { ok: false, error: "Autor inválido" };

  const date = asTrimmedString(r.date, 60);
  if (!date) return { ok: false, error: "Data inválida" };

  const readTime = asTrimmedString(r.readTime, 30);
  if (!readTime) return { ok: false, error: "Tempo de leitura inválido" };

  const gradient = asTrimmedString(r.gradient, 300);
  if (!gradient) return { ok: false, error: "Gradiente inválido" };

  return {
    ok: true,
    value: {
      slug,
      title,
      excerpt,
      content: sanitizeHtml(r.content),
      category,
      tag,
      author,
      date,
      readTime,
      gradient,
      featured: asBool(r.featured),
      featuredMain: asBool(r.featuredMain),
    },
  };
}
