import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import FadeUp from "@/components/FadeUp";
import { getShoppingLists } from "@/lib/supabase/queries";
import type { ShoppingListItem } from "@/hooks/useShoppingLists";
import type { Metadata } from "next";
import { safeUrlOrNull } from "@/lib/security/sanitize";

export const metadata: Metadata = {
  title: "Listas de Compra",
  description: "Seleções cuidadosas com os melhores produtos da Amazon para você economizar comprando com qualidade.",
  alternates: { canonical: "/listas" },
  openGraph: {
    title: "Listas de Compra | MD",
    description: "Seleções cuidadosas com os melhores produtos da Amazon para você economizar comprando com qualidade.",
    url: "/listas",
    type: "website",
  },
};

export const revalidate = 60;

export default async function ListasPage() {
  const lists = await getShoppingLists();

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="article-hero">
        <div className="article-hero-inner">
          <Link href="/" className="article-back">← Voltar ao Início</Link>
          <div className="article-tag-badge">Curadoria</div>
          <h1>Listas de Compra</h1>
          <p className="excerpt">
            Seleções cuidadosas com os melhores produtos da Amazon — testados, aprovados e com o melhor custo-benefício.
          </p>
          <div className="article-meta-bar">
            <span style={{ fontSize: "0.82rem", color: "var(--text-light)" }}>
              {lists.length} {lists.length === 1 ? "lista disponível" : "listas disponíveis"}
            </span>
          </div>
        </div>
      </div>

      {/* Aviso afiliados */}
      <div style={{ maxWidth: 900, margin: "2rem auto 0", padding: "0 2rem" }}>
        <div className="listas-aviso">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Como Associada da Amazon, ganho comissões com compras qualificadas feitas através dos links desta página, sem custo adicional para você.{" "}
          <Link href="/politica-de-privacidade" style={{ color: "var(--coral)", textDecoration: "underline" }}>Saiba mais</Link>.
        </div>
      </div>

      {/* Listas */}
      <div className="listas-page-body">
        {lists.length === 0 ? (
          <FadeUp>
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-light)" }}>
              <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p style={{ fontFamily: "var(--font-lora), 'Lora', serif", fontSize: "1.05rem" }}>
                Nenhuma lista disponível ainda. Volte em breve!
              </p>
              <Link href="/" className="btn-outline" style={{ marginTop: "1.5rem", display: "inline-block" }}>
                ← Voltar ao início
              </Link>
            </div>
          </FadeUp>
        ) : (
          lists.map((list, li) => (
            <FadeUp key={list.id} delay={li * 0.08}>
              <div className="listas-page-card">
                {/* Cabeçalho da lista */}
                <div className="listas-page-card-header">
                  <span className="lista-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </span>
                  <div>
                    <h2 className="listas-page-card-title">{list.name}</h2>
                    <span className="lista-count">{list.items?.length ?? 0} {list.items?.length === 1 ? "item" : "itens"}</span>
                  </div>
                </div>

                {/* Grid de itens */}
                {list.items && list.items.length > 0 ? (
                  <div className="listas-page-items-grid">
                    {list.items.map((item: ShoppingListItem) => {
                      const safeHref = safeUrlOrNull(item.affiliate_url);
                      const safeImg = safeUrlOrNull(item.image_url);
                      if (!safeHref) return null;
                      return (
                      <a
                        key={item.id}
                        href={safeHref}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="listas-page-item"
                      >
                        <div className="listas-page-item-img">
                          {safeImg
                            ? (
                              <Image
                                src={safeImg}
                                alt={`Foto do produto ${item.name} disponível na Amazon`}
                                width={120}
                                height={120}
                                sizes="120px"
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            )
                            : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                          }
                        </div>
                        <div className="listas-page-item-info">
                          <span className="listas-page-item-name">{item.name}</span>
                          {item.price && <span className="listas-page-item-price">{item.price}</span>}
                          <span className="listas-page-item-btn">Ver na Amazon →</span>
                        </div>
                      </a>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontFamily: "var(--font-lora), 'Lora', serif", fontSize: "0.9rem", color: "var(--text-light)", padding: "1rem 0" }}>
                    Itens sendo adicionados em breve.
                  </p>
                )}
              </div>
            </FadeUp>
          ))
        )}
      </div>

      <Newsletter />
      <Footer />
    </>
  );
}
