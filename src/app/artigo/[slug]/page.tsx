import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { getAllSlugs, getPostBySlug, getAllPosts } from "@/lib/supabase/queries";
import type { Post } from "@/lib/supabase/types";
import { sanitizeHtml } from "@/lib/security/sanitize";
import { SITE } from "@/lib/seo/site";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Artigo não encontrado", robots: { index: false } };

  const url = `/artigo/${post.slug}`;
  const publishedTime = /^\d{4}-\d{2}-\d{2}/.test(post.date) ? post.date : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      siteName: SITE.name,
      locale: SITE.locale,
      publishedTime,
      authors: [post.author],
      tags: [post.category, post.tag].filter(Boolean),
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [SITE.ogImage],
    },
  };
}

export default async function ArtigoPage({ params }: { params: { slug: string } }) {
  const [post, allPosts]: [Post | null, Post[]] = await Promise.all([
    getPostBySlug(params.slug),
    getAllPosts(),
  ]);

  if (!post) notFound();

  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const articleUrl = `${SITE.url}/artigo/${post.slug}`;
  const datePublished = /^\d{4}-\d{2}-\d{2}/.test(post.date) ? post.date : undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${SITE.url}${SITE.ogImage}`,
    inLanguage: SITE.language,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}${SITE.ogImage}` },
    },
    datePublished,
    dateModified: datePublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    articleSection: post.category,
    keywords: [post.category, post.tag].filter(Boolean).join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Artigos", item: `${SITE.url}/artigos` },
      { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />

      <div className="article-hero">
        <div className="article-hero-inner">
          <Link href="/" className="article-back">
            ← Voltar ao Início
          </Link>
          <div className="article-tag-badge">{post.tag}</div>
          <h1>{post.title}</h1>
          <p className="excerpt">{post.excerpt}</p>
          <div className="article-meta-bar">
            <span className="author">{post.author}</span>
            <span>•</span>
            <span>{
              post.date && /^\d{4}-\d{2}-\d{2}$/.test(post.date)
                ? new Date(post.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
                : post.date
            }</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      <div className="article-body">
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
      </div>

      {(prevPost || nextPost) && (
        <div className="article-footer-nav">
          {prevPost ? (
            <Link href={`/artigo/${prevPost.slug}`}>
              <div className="label">← Anterior</div>
              <div className="title">{prevPost.title}</div>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link href={`/artigo/${nextPost.slug}`} style={{ textAlign: "right" }}>
              <div className="label">Próximo →</div>
              <div className="title">{nextPost.title}</div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}

      <Newsletter />
      <Footer />
    </>
  );
}
