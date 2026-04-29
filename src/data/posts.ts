export type { Post } from "@/lib/supabase/types";

// Ícones por categoria — apenas mapeamento visual, sem contagens hardcoded
export const categoryIcons: Record<string, string> = {
  "Artigos":         "book",
  "Blog":            "pen",
  "Dicas de Compras":"cart",
  "Lifestyle":       "heart",
  "Tendências":      "book",
  "Tecnologia":      "pen",
  "Guia Prático":    "book",
  "Decoração":       "heart",
  "Bem-Estar":       "heart",
  "Finanças":        "cart",
};

export const tips = [
  {
    number: "01",
    title: "Compare Antes de Comprar",
    description: "Use comparadores de preço e espere promoções sazonais. A paciência é a melhor aliada do consumidor inteligente.",
    tag: "Economia",
  },
  {
    number: "02",
    title: "Leia Avaliações Reais",
    description: "Priorize reviews com fotos e detalhes. Avaliações genéricas podem ser falsas — busque experiências autênticas.",
    tag: "Segurança",
  },
  {
    number: "03",
    title: "Invista em Qualidade",
    description: "Produtos duráveis custam menos a longo prazo. Calcule o custo por uso antes de escolher a opção mais barata.",
    tag: "Custo-Benefício",
  },
  {
    number: "04",
    title: "Aproveite Programas de Fidelidade",
    description: "Acumule pontos e milhas estrategicamente. Muitos programas oferecem descontos exclusivos e frete grátis.",
    tag: "Benefícios",
  },
];
