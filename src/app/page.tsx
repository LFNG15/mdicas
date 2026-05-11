import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SobreMim from "@/components/SobreMim";
import FadeUp from "@/components/FadeUp";
import { CategoryIcon } from "@/components/CategoryIcon";
import { categoryIcons } from "@/data/posts";
import { categoryToSlug } from "@/lib/seo/slug";
import {
  getFeaturedPosts,
  getBlogPosts,
  getTotalPostCount,
  getCategoryCounts,
  getInstagramPosts,
  getShoppingLists,
  getGruposOfertas,
} from "@/lib/supabase/queries";
import InstagramFeed from "@/components/InstagramFeed";
import ShoppingLists from "@/components/ShoppingLists";
import GruposOfertas from "@/components/GruposOfertas";

export const revalidate = 60; // revalida a cada 60s em produção

export default async function Home() {
  const [featured, blogPosts, totalPosts, categoryCounts, instagramPosts, shoppingLists, gruposOfertas] = await Promise.all([
    getFeaturedPosts(),
    getBlogPosts(),
    getTotalPostCount(),
    getCategoryCounts(),
    getInstagramPosts(),
    getShoppingLists(),
    getGruposOfertas(),
  ]);

  const mainFeatured = featured.find((p) => p.featuredMain) ?? featured[0];
  const sideFeatured = featured.filter((p) => !p.featuredMain);

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1}>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-inner">
          <FadeUp>
            <div className="hero-tag">Economia Inteligente</div>
            <h1 className="hero-title">
              Qualidade que cabe<br />
              <em>no seu bolso.</em>
            </h1>
            <p className="hero-desc">
              Reúno em um só lugar os melhores achados da Amazon, ofertas
              exclusivas nos grupos e dicas práticas para você comprar bem
              pagando pouco.
            </p>
            <div className="hero-actions">
              <Link href="/listas" className="btn-primary">
                Ver Listas de Compra
              </Link>
              <Link href="/#grupos" className="btn-outline">
                Receber Ofertas
              </Link>
            </div>
          </FadeUp>

          {mainFeatured && (
            <FadeUp delay={0.2} className="hero-visual">
              <Link
                href={`/artigo/${mainFeatured.slug}`}
                className="hero-card"
                aria-label={`Ler artigo em destaque: ${mainFeatured.title}`}
              >
                <div className="hero-card-img" style={{ background: mainFeatured.gradient }} aria-hidden="true">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
                    <path d="M15 60V20c0-2 1-3 3-3h10c2 0 3 1 3 3v5c0 1 1 2 2 2h4c1 0 2-1 2-2v-5c0-2 1-3 3-3h10c2 0 3 1 3 3v40" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none"/>
                    <path d="M10 60h60" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
                    <rect x="22" y="28" width="8" height="6" rx="1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"/>
                    <rect x="50" y="28" width="8" height="6" rx="1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"/>
                    <rect x="22" y="40" width="8" height="6" rx="1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"/>
                    <rect x="50" y="40" width="8" height="6" rx="1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
                <div className="hero-card-body">
                  <div className="hero-card-cat">{mainFeatured.tag}</div>
                  <div className="hero-card-title">
                    {mainFeatured.title.length > 55
                      ? mainFeatured.title.slice(0, 55) + "..."
                      : mainFeatured.title}
                  </div>
                  <div className="hero-card-excerpt">
                    {mainFeatured.excerpt.slice(0, 90)}...
                  </div>
                  <div className="hero-card-meta">
                    <span>{mainFeatured.author}</span>
                    <span>•</span>
                    <span>{mainFeatured.readTime}</span>
                  </div>
                </div>
              </Link>
              <div className="hero-float-badge">
                <div className="number">{totalPosts}+</div>
                <div className="label">Artigos publicados</div>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* CATEGORIES — só faz sentido com diversidade real (> 3 categorias).
          O foco do site é afiliados (Listas, Grupos, Instagram); artigos são secundários. */}
      {categoryCounts.length > 3 && (
        <section className="categories" id="categorias">
          <FadeUp>
            <div className="section-header">
              <div className="section-tag">Explore</div>
              <h2 className="section-title">Nossas Categorias</h2>
              <p className="section-subtitle">
                Navegue por temas cuidadosamente selecionados para enriquecer sua
                experiência de leitura
              </p>
            </div>
          </FadeUp>
          <div className="cat-grid">
            {categoryCounts.map((cat, i) => (
              <FadeUp key={cat.name} delay={i * 0.1}>
                <Link
                  href={`/categoria/${categoryToSlug(cat.name)}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="cat-card">
                    <div className="cat-icon">
                      <CategoryIcon type={categoryIcons[cat.name] ?? "book"} />
                    </div>
                    <div className="cat-name">{cat.name}</div>
                    <div className="cat-count">{cat.count} publicação{cat.count !== 1 ? "ões" : ""}</div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED ARTICLES — só renderiza se houver acervo (> 3 artigos publicados).
          Abaixo disso, o Hero já cumpre o papel de vitrine sem soar prematuro. */}
      {mainFeatured && totalPosts > 3 && (
        <section className="featured" id="artigos">
          <FadeUp>
            <div className="section-header">
              <div className="section-tag">Destaques</div>
              <h2 className="section-title">Artigos em Destaque</h2>
              <p className="section-subtitle">
                As leituras mais populares selecionadas pela nossa equipe editorial
              </p>
            </div>
          </FadeUp>
          <FadeUp>
            <div className="featured-grid">
              <Link
                href={`/artigo/${mainFeatured.slug}`}
                className="feat-main"
                style={{ background: mainFeatured.gradient }}
                aria-label={`Artigo em destaque: ${mainFeatured.title}`}
              >
                {mainFeatured.coverImage && (
                  <Image
                    src={mainFeatured.coverImage}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="feat-main-image"
                  />
                )}
                <div className="feat-main-overlay" aria-hidden="true"></div>
                <div className="feat-main-content">
                  <span className="tag">{mainFeatured.tag}</span>
                  <h3>{mainFeatured.title}</h3>
                  <p>{mainFeatured.excerpt}</p>
                  <div className="meta">
                    Por {mainFeatured.author} • {mainFeatured.date} • {mainFeatured.readTime}
                  </div>
                </div>
              </Link>
              <div className="feat-side">
                {sideFeatured.length > 0 ? (
                  sideFeatured.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/artigo/${post.slug}`}
                      className="feat-card"
                    >
                      <div>
                        <span className="tag">{post.tag}</span>
                        <h4>{post.title}</h4>
                        <p>{post.excerpt}</p>
                      </div>
                      <div className="meta">
                        {post.date} • {post.readTime}
                      </div>
                    </Link>
                  ))
                ) : (
                  // Fallback se não houver posts em destaque além do principal
                  blogPosts.slice(0, 2).map((post) => (
                    <Link
                      key={post.slug}
                      href={`/artigo/${post.slug}`}
                      className="feat-card"
                    >
                      <div>
                        <span className="tag">{post.tag}</span>
                        <h4>{post.title}</h4>
                        <p>{post.excerpt}</p>
                      </div>
                      <div className="meta">
                        {post.date} • {post.readTime}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </FadeUp>
        </section>
      )}

      {/* LISTAS DE COMPRA */}
      <ShoppingLists lists={shoppingLists} />

      {/* BLOG GRID */}
      {blogPosts.length > 0 && (
        <section className="blog-section" id="blog">
          <FadeUp>
            <div className="section-header">
              <div className="section-tag">Últimas Postagens</div>
              <h2 className="section-title">Artigos Recentes</h2>
              <p className="section-subtitle">
                Fique por dentro das novidades com nossas publicações mais recentes
              </p>
            </div>
          </FadeUp>
          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <FadeUp key={post.slug} delay={i * 0.1}>
                <Link href={`/artigo/${post.slug}`} className="blog-card">
                  <div className="blog-card-img" style={!post.coverImage ? { background: post.gradient } : undefined}>
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
                        className="bg"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="bg" style={{ background: post.gradient }}></div>
                    )}
                  </div>
                  <div className="blog-card-body">
                    <span className="tag">{post.tag}</span>
                    <h4>{post.title}</h4>
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
          <FadeUp>
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <Link href="/artigos" className="btn-outline">
                Ver todos os artigos →
              </Link>
            </div>
          </FadeUp>
        </section>
      )}

      <GruposOfertas grupos={gruposOfertas} />
      <InstagramFeed posts={instagramPosts} />
      <SobreMim />
      </main>
      <Footer />
    </>
  );
}
