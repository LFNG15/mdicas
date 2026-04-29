/**
 * Seed script: importa os artigos originais do blog para o Sanity.
 * Requer SANITY_API_TOKEN com permissão de escrita no .env.local
 *
 * Como usar:
 *   node scripts/seed-sanity.mjs
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carrega .env.local manualmente
const envPath = resolve(__dirname, "../.env.local");
try {
  const env = readFileSync(envPath, "utf-8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {
  console.error("❌  .env.local não encontrado. Crie-o com as variáveis do Sanity.");
  process.exit(1);
}

const { NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN } = process.env;

if (!NEXT_PUBLIC_SANITY_PROJECT_ID || !SANITY_API_TOKEN) {
  console.error("❌  Faltam variáveis de ambiente. Verifique .env.local:");
  console.error("    NEXT_PUBLIC_SANITY_PROJECT_ID");
  console.error("    NEXT_PUBLIC_SANITY_DATASET");
  console.error("    SANITY_API_TOKEN  (token com permissão de escrita)");
  process.exit(1);
}

const client = createClient({
  projectId: NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: SANITY_API_TOKEN,
  useCdn: false,
});

// Converte HTML simples (p, h2, h3) em blocos Portable Text
function htmlToBlocks(html) {
  const blocks = [];
  const tagPattern = /<(h2|h3|p)>([\s\S]*?)<\/\1>/g;
  let match;
  while ((match = tagPattern.exec(html)) !== null) {
    const [, tag, raw] = match;
    const text = raw.replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    blocks.push({
      _type: "block",
      _key: Math.random().toString(36).slice(2),
      style: tag === "p" ? "normal" : tag,
      children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text, marks: [] }],
      markDefs: [],
    });
  }
  return blocks;
}

const posts = [
  {
    slug: "futuro-consumo-consciente",
    title: "O Futuro do Consumo Consciente: Como Suas Escolhas Impactam o Mundo",
    excerpt: "Uma análise profunda sobre como pequenas mudanças nos hábitos de compra podem gerar um impacto significativo na sustentabilidade global.",
    html: `<p>O consumo consciente não é apenas uma tendência passageira — é uma transformação profunda na maneira como nos relacionamos com produtos, marcas e o planeta. A cada decisão de compra, estamos moldando o futuro das cadeias produtivas e do meio ambiente.</p><h2>O que é consumo consciente?</h2><p>Consumo consciente vai além de simplesmente comprar menos. Trata-se de fazer escolhas informadas, considerando o impacto social, ambiental e econômico de cada aquisição. Desde a origem da matéria-prima até o descarte final, cada etapa importa.</p><h2>Por que isso importa agora?</h2><p>Dados recentes mostram que 73% dos consumidores brasileiros já consideram a sustentabilidade um fator decisivo na hora da compra. Essa mudança de mentalidade está forçando empresas a repensarem suas práticas — desde embalagens biodegradáveis até cadeias de suprimento transparentes.</p><h2>Como começar?</h2><p>Não é preciso mudar tudo de uma vez. Comece questionando: "Eu realmente preciso disso?" Antes de cada compra, pesquise sobre a marca, verifique certificações ambientais e considere alternativas de segunda mão ou locais.</p><h2>O papel da tecnologia</h2><p>Aplicativos de rastreamento de pegada de carbono, plataformas de economia circular e marketplaces de produtos sustentáveis estão tornando o consumo consciente mais acessível do que nunca. A tecnologia é nossa aliada nessa jornada.</p><h2>Pequenas mudanças, grande impacto</h2><p>Trocar sacolas plásticas por ecobags, preferir produtos a granel, escolher marcas com certificação B Corp — são gestos simples que, multiplicados por milhões de consumidores, transformam mercados inteiros. Seu poder de escolha é maior do que você imagina.</p>`,
    category: "Tendências", tag: "Tendências", author: "Mari Nascimento",
    date: "31 de Março, 2026", readTime: "12 min de leitura",
    gradient: "linear-gradient(135deg, #F07B6E 0%, #D9685C 100%)",
    featured: true, featuredMain: true,
  },
  {
    slug: "ia-no-varejo",
    title: "IA no Varejo: A Revolução Silenciosa que Transforma Suas Compras",
    excerpt: "Como algoritmos inteligentes estão personalizando a experiência de compra e ajudando consumidores a economizar.",
    html: `<p>Você já percebeu como as sugestões de produtos parecem cada vez mais certeiras? Isso não é coincidência — é inteligência artificial trabalhando nos bastidores para entender seus padrões e preferências de consumo.</p><h2>Personalização em tempo real</h2><p>Os algoritmos modernos analisam centenas de variáveis — desde seu histórico de navegação até a hora do dia em que você costuma comprar — para criar experiências sob medida. O resultado? Menos tempo procurando, mais tempo aproveitando.</p><h2>Preços dinâmicos a seu favor</h2><p>Ferramentas de monitoramento de preço baseadas em IA rastreiam milhares de produtos simultaneamente, alertando quando é o melhor momento para comprar. Consumidores que usam essas ferramentas economizam em média 23% em suas compras online.</p><h2>Assistentes de compra virtuais</h2><p>Chatbots inteligentes estão substituindo o atendimento genérico por conversas personalizadas. Eles lembram suas preferências, sugerem combinações de produtos e até antecipam suas necessidades com base em padrões sazonais.</p><h2>O futuro já chegou</h2><p>Realidade aumentada para experimentar produtos virtualmente, análise preditiva de estoque e logística otimizada por machine learning — o varejo está vivendo sua maior revolução tecnológica, e quem sai ganhando é o consumidor.</p>`,
    category: "Tecnologia", tag: "Tecnologia", author: "Carlos Mendes",
    date: "28 de Março, 2026", readTime: "8 min de leitura",
    gradient: "linear-gradient(135deg, #D9685C 0%, #F07B6E 100%)",
    featured: true, featuredMain: false,
  },
  {
    slug: "minimalismo-financeiro",
    title: "Minimalismo Financeiro: Compre Menos, Viva Mais",
    excerpt: "Estratégias práticas para simplificar suas finanças e focar no que realmente importa.",
    html: `<p>Em um mundo que nos bombardeia com estímulos de consumo 24 horas por dia, o minimalismo financeiro surge como um antídoto poderoso. Não se trata de viver com pouco — mas de viver com o suficiente.</p><h2>O paradoxo da abundância</h2><p>Estudos mostram que a partir de certo patamar de renda, mais dinheiro não significa mais felicidade. O excesso de opções gera ansiedade, e o acúmulo de bens cria uma manutenção invisível que consome tempo e energia.</p><h2>Os 4 pilares do minimalismo financeiro</h2><p>Intencionalidade nas compras, eliminação de assinaturas desnecessárias, investimento em experiências ao invés de coisas, e a construção de uma reserva que traga paz — esses são os pilares que sustentam uma vida financeira mais leve.</p><h2>Na prática: o desafio de 30 dias</h2><p>Antes de qualquer compra não-essencial, anote o item e espere 30 dias. Se depois desse período você ainda quiser, compre sem culpa. Você vai se surpreender com quantos desejos simplesmente desaparecem.</p><h2>Liberdade é o verdadeiro luxo</h2><p>Quando você gasta menos do que ganha e investe a diferença, cada mês você compra um pouco mais de liberdade. Menos dívidas, menos preocupações, mais tempo para o que realmente importa.</p>`,
    category: "Guia Prático", tag: "Guia Prático", author: "Ana Oliveira",
    date: "25 de Março, 2026", readTime: "6 min de leitura",
    gradient: "linear-gradient(135deg, #F5A49B 0%, #F07B6E 100%)",
    featured: true, featuredMain: false,
  },
  {
    slug: "ambientes-aconchegantes",
    title: "Como Criar Ambientes Aconchegantes Gastando Pouco",
    excerpt: "Dicas práticas e acessíveis para transformar qualquer espaço em um refúgio confortável.",
    html: `<p>Transformar sua casa em um espaço acolhedor não exige um orçamento milionário. Com criatividade, boas referências e algumas técnicas simples, é possível criar ambientes que abraçam — literalmente.</p><h2>Iluminação: o segredo mais subestimado</h2><p>Troque lâmpadas frias por tons quentes (2700K). Adicione luminárias de mesa e cordões de luz. A iluminação indireta transforma instantaneamente qualquer ambiente, criando camadas de conforto visual.</p><h2>Têxteis que aquecem</h2><p>Mantas, almofadas e tapetes são seus melhores aliados. Aposte em texturas variadas — tricô grosso, linho, veludo. A combinação de texturas diferentes cria profundidade e interesse visual sem gastar muito.</p><h2>Plantas: vida e cor</h2><p>Plantas purificam o ar e trazem a natureza para dentro de casa. Comece com espécies resistentes como jiboias, espadas-de-são-jorge e suculentas. Vasos de barro ou cestos de palha completam o visual.</p><h2>O poder dos detalhes</h2><p>Velas aromáticas, livros empilhados como decoração, uma bandeja organizada na mesa de centro — são os pequenos detalhes que transformam um espaço genérico em um lar com personalidade.</p>`,
    category: "Decoração", tag: "Decoração", author: "Juliana Costa",
    date: "22 de Março, 2026", readTime: "5 min de leitura",
    gradient: "linear-gradient(135deg, #F07B6E 0%, #F5A49B 100%)",
    featured: false, featuredMain: false,
  },
  {
    slug: "rotina-matinal",
    title: "Rotina Matinal: 7 Hábitos Para Começar o Dia Com Energia",
    excerpt: "Transforme suas manhãs com rituais simples que aumentam produtividade e bem-estar.",
    html: `<p>A maneira como você começa o dia define o tom das próximas horas. Uma rotina matinal bem construída não precisa ser complexa — precisa ser consistente e alinhada com seus objetivos.</p><h2>1. Acorde sem o snooze</h2><p>Cada vez que você aperta o snooze, seu corpo inicia um novo ciclo de sono que será interrompido em minutos. Coloque o despertador longe da cama e levante-se ao primeiro toque.</p><h2>2. Hidrate-se imediatamente</h2><p>Após 7-8 horas sem água, seu corpo está desidratado. Um copo de água com limão em jejum ativa o metabolismo e melhora a digestão.</p><h2>3. Movimento matinal</h2><p>Não precisa ser uma hora de academia. 10 minutos de alongamento ou uma caminhada curta já ativam a circulação e liberam endorfina suficiente para começar o dia com disposição.</p><h2>4. Diário de gratidão</h2><p>Escreva 3 coisas pelas quais é grato. Esse exercício simples reprograma seu cérebro para focar no positivo e reduz significativamente os níveis de estresse ao longo do dia.</p><h2>5-7. Alimentação, foco e planejamento</h2><p>Um café da manhã nutritivo, 5 minutos de meditação e uma lista das 3 prioridades do dia completam a rotina. Simples, poderoso e transformador.</p>`,
    category: "Bem-Estar", tag: "Bem-Estar", author: "Pedro Santos",
    date: "19 de Março, 2026", readTime: "7 min de leitura",
    gradient: "linear-gradient(135deg, #D9685C 0%, #F07B6E 100%)",
    featured: false, featuredMain: false,
  },
  {
    slug: "cashback-cupons-guia",
    title: "Cashback e Cupons: O Guia Definitivo Para Economizar Online",
    excerpt: "Aprenda a usar ferramentas digitais para nunca mais pagar preço cheio.",
    html: `<p>Se você ainda compra online sem usar cashback ou cupons de desconto, está literalmente deixando dinheiro na mesa. Com as ferramentas certas, economizar se torna automático.</p><h2>O que é cashback e como funciona?</h2><p>Cashback é a devolução de uma porcentagem do valor da compra. Plataformas como Méliuz, Zoom e PicPay oferecem entre 1% e 30% de volta, dependendo da loja e da promoção.</p><h2>Extensões de navegador essenciais</h2><p>Instale extensões que aplicam cupons automaticamente no checkout. Ferramentas como Honey e CupomValido testam centenas de códigos em segundos, encontrando o melhor desconto disponível.</p><h2>Estratégia de acúmulo</h2><p>Combine cashback com cupons de desconto e promoções sazonais. Em datas como Black Friday, é possível economizar mais de 50% no valor original usando essa tríplice estratégia.</p><h2>Cuidados importantes</h2><p>Cashback não é motivo para comprar o que não precisa. Use-o como ferramenta de economia em compras planejadas, não como justificativa para gastos impulsivos.</p>`,
    category: "Finanças", tag: "Finanças", author: "Rodrigo Lima",
    date: "15 de Março, 2026", readTime: "6 min de leitura",
    gradient: "linear-gradient(135deg, #F5A49B 0%, #FAF3EF 100%)",
    featured: false, featuredMain: false,
  },
];

async function seed() {
  console.log(`\n🌱  Iniciando seed para projeto: ${NEXT_PUBLIC_SANITY_PROJECT_ID} / ${NEXT_PUBLIC_SANITY_DATASET ?? "production"}\n`);

  const transaction = client.transaction();

  for (const post of posts) {
    const doc = {
      _id: `post-${post.slug}`,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.excerpt,
      content: htmlToBlocks(post.html),
      category: post.category,
      tag: post.tag,
      author: post.author,
      date: post.date,
      readTime: post.readTime,
      gradient: post.gradient,
      featured: post.featured,
      featuredMain: post.featuredMain,
    };

    transaction.createOrReplace(doc);
    console.log(`  ✓  ${post.title}`);
  }

  await transaction.commit();
  console.log(`\n✅  ${posts.length} artigos importados com sucesso!\n`);
}

seed().catch((err) => {
  console.error("\n❌  Erro durante o seed:", err.message);
  process.exit(1);
});
