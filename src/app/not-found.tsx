import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBlogPosts } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "A página que você procura não existe ou foi movida. Veja nossas publicações mais recentes.",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  let recent: { slug: string; title: string; tag: string }[] = [];
  try {
    const posts = await getBlogPosts();
    recent = posts.slice(0, 3).map((p) => ({ slug: p.slug, title: p.title, tag: p.tag }));
  } catch {
    recent = [];
  }

  return (
    <>
      <Navbar />

      <section
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "140px 2rem 60px",
          background: "linear-gradient(165deg, var(--white) 0%, var(--cream) 100%)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(4rem, 12vw, 7rem)",
              fontWeight: 800,
              color: "var(--coral)",
              lineHeight: 1,
              marginBottom: "1rem",
            }}
          >
            404
          </div>
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              marginBottom: "1rem",
              color: "var(--text-dark)",
            }}
          >
            Página não encontrada
          </h1>
          <p
            style={{
              fontFamily: "var(--font-lora), 'Lora', serif",
              fontSize: "1.05rem",
              color: "var(--text-light)",
              lineHeight: 1.7,
              maxWidth: 520,
              margin: "0 auto 2rem",
            }}
          >
            O endereço que você acessou não existe, foi movido ou pode ter sido removido. Que tal continuar a leitura por outro caminho?
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
            <Link href="/" className="btn-primary">Voltar ao início</Link>
            <Link href="/artigos" className="btn-outline">Ver todos os artigos</Link>
          </div>

          {recent.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <div
                style={{
                  fontSize: ".75rem",
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                  color: "var(--coral)",
                  fontWeight: 600,
                  marginBottom: "1.2rem",
                }}
              >
                Sugestões de leitura
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: ".6rem" }}>
                {recent.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/artigo/${p.slug}`}
                      style={{
                        display: "inline-block",
                        fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                        color: "var(--text-dark)",
                        textDecoration: "none",
                        fontSize: "1.05rem",
                      }}
                    >
                      <span style={{ color: "var(--coral)", marginRight: ".5rem" }}>{p.tag}</span>
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
