export const SITE = {
  name: "MD",
  fullName: "MD | Artigos, Blog & Dicas",
  description:
    "Seu espaço editorial de artigos envolventes, dicas inteligentes de compras e conteúdos que transformam a forma como você vê o mundo.",
  locale: "pt_BR",
  language: "pt-BR",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://md-blog.vercel.app",
  themeColor: "#F07B6E",
  background: "#FAF3EF",
  ogImage: "/logo-light.jpg",
  twitter: "@",
} as const;
