import Link from "next/link";
import { categoryToSlug } from "@/lib/seo/slug";

const CATEGORIAS_DESTAQUE = ["Tendências", "Tecnologia", "Lifestyle", "Finanças"];

export default function Footer() {
  return (
    <footer className="footer" aria-labelledby="footer-title">
      <h2 id="footer-title" className="visually-hidden">Rodapé do site</h2>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="logo" aria-hidden="true">M | D</div>
          <p>
            Seu espaço editorial de conteúdo relevante, dicas inteligentes e
            inspiração para um estilo de vida mais consciente.
          </p>
        </div>
        <nav aria-labelledby="footer-nav-title">
          <h5 id="footer-nav-title">Navegação</h5>
          <ul>
            <li><Link href="/">Início</Link></li>
            <li><Link href="/artigos">Artigos</Link></li>
            <li><Link href="/listas">Listas & Dicas</Link></li>
            <li><Link href="/#grupos">Grupos de Ofertas</Link></li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-cats-title">
          <h5 id="footer-cats-title">Categorias</h5>
          <ul>
            {CATEGORIAS_DESTAQUE.map((nome) => (
              <li key={nome}>
                <Link href={`/categoria/${categoryToSlug(nome)}`}>{nome}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h5 id="footer-contact-title">Contato</h5>
          <ul aria-labelledby="footer-contact-title">
            <li>
              <a href="mailto:contato@md.com.br" aria-label="Enviar email para contato@md.com.br">
                contato@md.com.br
              </a>
            </li>
            <li><Link href="/#sobre">Sobre Nós</Link></li>
            <li><Link href="/politica-de-privacidade">Política de Privacidade</Link></li>
            <li><Link href="/politica-de-privacidade#2">Programa de Afiliados</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 MD. Todos os direitos reservados.</span>
        <div>
          <a
            href="https://lumenconnection.com.br"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Feito por Lumen Connection (abre em nova aba)"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Feito por Lumen Connection
          </a>
        </div>
      </div>
    </footer>
  );
}
