import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="logo">M | D</div>
          <p>
            Seu espaço editorial de conteúdo relevante, dicas inteligentes e
            inspiração para um estilo de vida mais consciente.
          </p>
        </div>
        <div>
          <h5>Navegação</h5>
          <ul>
            <li><Link href="/">Início</Link></li>
            <li><Link href="/artigos">Artigos</Link></li>
            <li><Link href="/listas">Listas & Dicas</Link></li>
            <li><Link href="/#grupos">Grupos de Ofertas</Link></li>
          </ul>
        </div>
        <div>
          <h5>Categorias</h5>
          <ul>
            <li><Link href="#">Tendências</Link></li>
            <li><Link href="#">Tecnologia</Link></li>
            <li><Link href="#">Lifestyle</Link></li>
            <li><Link href="#">Finanças</Link></li>
          </ul>
        </div>
        <div>
          <h5>Contato</h5>
          <ul>
            <li><Link href="#">contato@md.com.br</Link></li>
            <li><Link href="#">Sobre Nós</Link></li>
            <li><Link href="/politica-de-privacidade">Política de Privacidade</Link></li>
            <li><Link href="/politica-de-privacidade#2">Programa de Afiliados</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 MD. Todos os direitos reservados.</span>
        <div className="">
          <a href="https://lumenconnection.com.br" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Feito por Lumen Connection</a>
        </div>
      </div>
    </footer>
  );
}
