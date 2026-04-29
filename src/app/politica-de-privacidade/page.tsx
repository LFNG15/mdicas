import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Saiba como coletamos, usamos e protegemos seus dados, e como funcionam nossos links de afiliados.",
  alternates: { canonical: "/politica-de-privacidade" },
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "2.5rem" }}>
    <h2 style={{
      fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: "1.35rem",
      fontWeight: 700, color: "var(--text-dark)", marginBottom: "1rem",
      paddingBottom: "0.5rem", borderBottom: "1px solid var(--divider)",
    }}>
      {title}
    </h2>
    <div style={{ fontFamily: "var(--font-lora), 'Lora', serif", fontSize: "0.97rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
      {children}
    </div>
  </div>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ marginBottom: "1rem" }}>{children}</p>
);

export default function PoliticaDePrivacidade() {
  const updated = "4 de abril de 2026";

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="article-hero">
        <div className="article-hero-inner">
          <Link href="/" className="article-back">← Voltar ao Início</Link>
          <div className="article-tag-badge">Legal</div>
          <h1>Política de Privacidade</h1>
          <p className="excerpt">
            Transparência sobre como seus dados são tratados e como funcionam os links de afiliados neste site.
          </p>
          <div className="article-meta-bar">
            <span style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
              Última atualização: {updated}
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="article-body">

        <Section title="1. Programa de Afiliados Amazon">
          <P>
            Este site participa do <strong>Programa de Associados da Amazon</strong>, um programa de publicidade por afiliados desenvolvido para oferecer um meio de ganhar taxas de publicidade através de links para produtos da Amazon.com.br.
          </P>
          <P>
            <strong>Como Associada da Amazon, ganho comissões com compras qualificadas feitas através dos links presentes neste site, sem nenhum custo adicional para você.</strong> O preço que você paga é exatamente o mesmo, independentemente de usar ou não meu link.
          </P>
          <P>
            Os links de afiliados são identificados visualmente e marcados com o atributo <code>rel="sponsored"</code> conforme as boas práticas da web. As recomendações feitas neste site refletem minha opinião honesta — só indico produtos em que acredito.
          </P>
        </Section>

        <Section title="2. Outros links de afiliados">
          <P>
            Além da Amazon, este site pode eventualmente conter links de outros programas de afiliados. Em todos os casos, a existência de uma relação de afiliado será indicada claramente, e minha opinião sobre os produtos permanece independente de qualquer remuneração.
          </P>
        </Section>

        <Section title="3. Dados que coletamos">
          <P>
            Este site não coleta dados pessoais de forma direta (nome, e-mail, CPF etc.) sem o seu consentimento expresso. Eventualmente poderemos oferecer formulários de contato ou newsletter — nesses casos, os dados fornecidos são usados exclusivamente para a finalidade declarada.
          </P>
          <P>
            Como qualquer site na internet, nossos servidores registram automaticamente informações básicas de acesso como endereço IP, tipo de navegador, páginas visitadas e data/hora das visitas. Esses dados são usados exclusivamente para análise de tráfego e melhoria do conteúdo.
          </P>
        </Section>

        <Section title="4. Cookies">
          <P>
            Este site pode utilizar cookies para melhorar a experiência de navegação. Cookies são pequenos arquivos de texto armazenados no seu dispositivo. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades do site.
          </P>
          <P>
            Links de afiliados (como os da Amazon) podem gerar cookies nos servidores da Amazon para rastrear que a compra foi indicada por este site — isso é feito pelos sistemas da Amazon e segue a política de privacidade deles.
          </P>
        </Section>

        <Section title="5. Seus direitos (LGPD)">
          <P>
            Em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>, você tem direito a:
          </P>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            {[
              "Confirmar a existência de tratamento dos seus dados pessoais",
              "Acessar seus dados pessoais",
              "Solicitar a correção de dados incompletos ou desatualizados",
              "Solicitar a eliminação de dados desnecessários ou tratados em desconformidade com a LGPD",
              "Revogar o consentimento a qualquer momento",
            ].map(d => (
              <li key={d} style={{ marginBottom: "0.5rem" }}>{d}</li>
            ))}
          </ul>
          <P>
            Para exercer qualquer um desses direitos, entre em contato pelo e-mail disponível na seção de contato do site.
          </P>
        </Section>

        <Section title="6. Links externos">
          <P>
            Este site contém links para sites externos (como a Amazon). Não somos responsáveis pelas práticas de privacidade ou pelo conteúdo desses sites. Recomendamos que você leia as políticas de privacidade de cada site que visitar.
          </P>
        </Section>

        <Section title="7. Alterações nesta política">
          <P>
            Esta Política de Privacidade pode ser atualizada periodicamente. A data da última atualização sempre será indicada no topo desta página. O uso continuado do site após qualquer alteração constitui sua aceitação das mudanças.
          </P>
        </Section>

        <Section title="8. Contato">
          <P>
            Em caso de dúvidas sobre esta política ou sobre o tratamento dos seus dados, entre em contato:
          </P>
          <div style={{
            padding: "1rem 1.5rem", background: "rgba(240,123,110,0.06)",
            border: "1px solid rgba(240,123,110,0.2)", borderRadius: 12,
            fontSize: "0.9rem",
          }}>
            <strong>MD — Mariane Nascimento</strong><br />
            E-mail: <Link href="/#contato" style={{ color: "var(--coral)" }}>contato@md.com.br</Link>
          </div>
        </Section>

      </div>

      <Footer />
    </>
  );
}
