"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import FadeUp from "@/components/FadeUp";
import type { Post } from "@/lib/supabase/types";

type SortOption = "recentes" | "antigos" | "az" | "za";

interface Props {
  posts: Post[];
  categoryCounts: { name: string; count: number }[];
}

export default function ArtigosClient({ posts, categoryCounts }: Props) {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState<SortOption>("recentes");

  const filtered = useMemo(() => {
    let result = posts;

    if (categoriaAtiva) {
      result = result.filter((p) => p.category === categoriaAtiva);
    }

    if (busca.trim()) {
      const q = busca.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) => {
      if (ordem === "az") return a.title.localeCompare(b.title);
      if (ordem === "za") return b.title.localeCompare(a.title);
      // "recentes" / "antigos" — usa posição original do array (já ordenado por created_at desc)
      const ai = posts.indexOf(a);
      const bi = posts.indexOf(b);
      return ordem === "recentes" ? ai - bi : bi - ai;
    });
  }, [posts, categoriaAtiva, busca, ordem]);

  const btnStyle = (active: boolean) => ({
    padding: "0.4rem 1.1rem",
    borderRadius: 30,
    fontSize: "0.78rem" as const,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    border: "1.5px solid",
    borderColor: active ? "var(--coral)" : "var(--divider)",
    color: active ? "var(--coral)" : "var(--text-light)",
    background: active ? "rgba(240,123,110,0.06)" : "transparent",
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    transition: "all 0.2s",
  });

  const selectStyle = {
    padding: "0.4rem 1rem",
    borderRadius: 30,
    fontSize: "0.78rem",
    fontWeight: 600,
    border: "1.5px solid var(--divider)",
    color: "var(--text-light)",
    background: "var(--white)",
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    outline: "none",
    appearance: "none" as const,
    paddingRight: "2rem",
  };

  return (
    <>
      {/* BARRA DE FILTROS */}
      <div
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--divider)",
          padding: "1rem 2rem",
          position: "sticky",
          top: 72,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            gap: "0.8rem",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Categorias */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => setCategoriaAtiva(null)} style={btnStyle(!categoriaAtiva)}>
              Todos
            </button>
            {categoryCounts.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategoriaAtiva(cat.name === categoriaAtiva ? null : cat.name)}
                style={btnStyle(categoriaAtiva === cat.name)}
                title={`${cat.count} artigo${cat.count !== 1 ? "s" : ""}`}
              >
                {cat.name}
                <span
                  style={{
                    marginLeft: "0.35rem",
                    fontSize: "0.65rem",
                    opacity: 0.7,
                  }}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Busca + Ordenação */}
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: 30,
                border: "1.5px solid var(--divider)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: "0.82rem",
                color: "var(--text-dark)",
                outline: "none",
                width: 180,
                background: "var(--white)",
              }}
            />
            <div style={{ position: "relative" }}>
              <select
                value={ordem}
                onChange={(e) => setOrdem(e.target.value as SortOption)}
                style={selectStyle}
              >
                <option value="recentes">Mais recentes</option>
                <option value="antigos">Mais antigos</option>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
              </select>
              <span
                style={{
                  position: "absolute",
                  right: "0.7rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  fontSize: "0.6rem",
                  color: "var(--text-light)",
                }}
              >
                ▼
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <section style={{ background: "var(--cream)", padding: "3rem 2rem 6rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-light)",
              marginBottom: "1.5rem",
              letterSpacing: "0.04em",
            }}
          >
            {filtered.length} artigo{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            {categoriaAtiva ? ` em "${categoriaAtiva}"` : ""}
            {busca.trim() ? ` para "${busca}"` : ""}
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: "var(--text-light)",
                fontFamily: "var(--font-lora), 'Lora', serif",
              }}
            >
              Nenhum artigo encontrado.{" "}
              <button
                onClick={() => { setCategoriaAtiva(null); setBusca(""); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--coral)",
                  cursor: "pointer",
                  fontFamily: "var(--font-lora), 'Lora', serif",
                  fontSize: "inherit",
                  textDecoration: "underline",
                }}
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "2rem",
              }}
            >
              {filtered.map((post, i) => (
                <FadeUp key={post.slug} delay={(i % 3) * 0.08}>
                  <Link href={`/artigo/${post.slug}`} className="blog-card">
                    <div className="blog-card-img">
                      <div className="bg" style={{ background: post.gradient }} />
                    </div>
                    <div className="blog-card-body">
                      <span className="tag">{post.tag}</span>
                      <h4>{post.title}</h4>
                      <p>{post.excerpt}</p>
                    </div>
                    <div className="blog-card-footer">
                      <span>{post.date} · {post.readTime}</span>
                      <span className="read-more">Ler mais →</span>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
