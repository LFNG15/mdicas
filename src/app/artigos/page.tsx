import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import FadeUp from "@/components/FadeUp";
import { getAllPosts, getTotalPostCount, getCategoryCounts } from "@/lib/supabase/queries";
import ArtigosClient from "./ArtigosClient";

export const revalidate = 60;

export const metadata = {
  title: "Todos os Artigos",
  description: "Explore todos os artigos publicados no MD Blog.",
  alternates: { canonical: "/artigos" },
  openGraph: {
    title: "Todos os Artigos | MD",
    description: "Explore todos os artigos publicados no MD Blog.",
    url: "/artigos",
    type: "website",
  },
};

export default async function Artigos() {
  const [posts, total, categoryCounts] = await Promise.all([
    getAllPosts(),
    getTotalPostCount(),
    getCategoryCounts(),
  ]);

  return (
    <>
      <Navbar />

      <section
        style={{
          padding: "140px 2rem 60px",
          background: "linear-gradient(165deg, var(--white) 0%, var(--cream) 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -150,
            right: -150,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(240,123,110,0.07) 0%, transparent 70%)",
          }}
        />
        <FadeUp>
          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div className="section-tag" style={{ justifyContent: "flex-start" }}>
              Publicações
            </div>
            <h1
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: "1rem",
              }}
            >
              Todos os Artigos
            </h1>
            <p
              style={{
                fontFamily: "var(--font-lora), 'Lora', serif",
                fontSize: "1.05rem",
                color: "var(--text-light)",
                lineHeight: 1.7,
                maxWidth: 520,
              }}
            >
              {total} publicações disponíveis para você explorar.
            </p>
          </div>
        </FadeUp>
      </section>

      <ArtigosClient posts={posts} categoryCounts={categoryCounts} />

      <Newsletter />
      <Footer />
    </>
  );
}
