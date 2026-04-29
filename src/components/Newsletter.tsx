import Image from "next/image";

export default function Newsletter() {
  return (
    <section className="sobre-mim" id="contato">
      <div className="sobre-mim-inner">
        <div className="sobre-mim-foto">
          <Image
            src="/perfilmarinascimento.jpg"
            alt="Marina Nascimento"
            width={340}
            height={420}
            className="sobre-mim-img"
          />
        </div>
        <div className="sobre-mim-texto">
          <div className="section-tag">Sobre mim</div>
          <h2 className="section-title">Te Ajudo</h2>
          <ul className="sobre-mim-lista">
            <li>A economizar comprando pela internet;</li>
            <li>Avaliar o custo x benefício dos produtos;</li>
            <li>Ter produtos de qualidade pagando pouco.</li>
          </ul>
          <p className="sobre-mim-desc">
            Sou afiliada e compartilho as melhores ofertas e dicas para você
            consumir de forma mais inteligente e consciente.
          </p>
        </div>
      </div>
    </section>
  );
}
