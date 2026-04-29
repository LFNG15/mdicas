import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import FadeUp from "@/components/FadeUp";
import {
  getDistinctCategories,
  getPostsByCategory,
} from "@/lib/supabase/queries";
import { categoryToSlug } from "@/lib/seo/slug";
import { SITE } from "@/lib/seo/site";

export const revalidate = 300;

async function resolveCategoryFromSlug(slug: string) {
  const categories = await getDistinctCategories();
  return categories.find((c) => categoryToSlug(c) === slug) ?? null;
}

export async function generateStaticParams() {
  const categories = await getDistinctCategories();
  return categories.map((c) => ({ slug: categoryToSlug(c) }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await resolveCategoryFromSlug(params.slug);
  if (!category) return { title: "Categoria não encontrada", robots: { index: false } };
  const url = `/categoria/${params.slug}`;
  const description = `Artigos publicados na categoria ${category} no MD Blog.`;
  return {
    title: `${category}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${category} | ${SITE.name}`,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
    },
    twitter: { card: "summary", title: category, description },
  };
}

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const category = await resolveCategoryFromSlug(params.slug);
  if (!category) notFound();

  const posts = await getPostsByCategory(category);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Artigos", item: `${SITE.url}/artigos` },
      { "@type": "ListItem", position: 3, name: category, item: `${SITE.url}/categoria/${params.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />

      <div className="article-hero">
        <div className="article-hero-inner">
          <Link href="/artigos" className="article-back">← Todos os Artigos</Link>
          <div className="article-tag-badge">Categoria</div>
          <h1>{category}</h1>
          <p className="excerpt">
            {posts.length} {posts.length === 1 ? "publicação" : "publicações"} em {category}.
          </p>
        </div>
      </div>

      <section className="blog-section">
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <p>Sem publicações nesta categoria ainda.</p>
            <Link href="/artigos" className="btn-outline" style={{ marginTop: "1.5rem", display: "inline-block" }}>
              Ver todos os artigos
            </Link>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post, i) => (
              <FadeUp key={post.slug} delay={i * 0.05}>
                <Link href={`/artigo/${post.slug}`} className="blog-card">
                  <div className="blog-card-img">
                    <div className="bg" style={{ background: post.gradient }} />
                  </div>
                  <div className="blog-card-body">
                    <span className="tag">{post.tag}</span>
                    <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.3, marginBottom: ".5rem" }}>{post.title}</h2>
                    <p>{post.excerpt}</p>
                  </div>
                  <div className="blog-card-footer">
                    <span>{post.date}</span>
                    <span className="read-more">Ler mais →</span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        )}
      </section>

      <Newsletter />
      <Footer />
    </>
  );
}
