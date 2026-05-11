export const SITE = {
  name: "MD",
  fullName: "MD | Ofertas, Listas e Achados",
  description:
    "Curadoria de produtos com o melhor custo-benefício, ofertas exclusivas em grupos de WhatsApp e Telegram, e dicas práticas para você comprar bem pagando pouco.",
  locale: "pt_BR",
  language: "pt-BR",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://md-blog.vercel.app",
  themeColor: "#F07B6E",
  background: "#FAF3EF",
  // OG card 1200×630 gerado dinamicamente em /opengraph-image (next/og).
  ogImage: "/opengraph-image",
  // Logo quadrado para schema.org Organization (Rich Results / Knowledge Panel).
  logo: "/logo-light.jpg",
  twitter: "@",
} as const;
