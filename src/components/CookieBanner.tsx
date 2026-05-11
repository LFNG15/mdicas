"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-banner"
      role="region"
      aria-label="Aviso de uso de cookies"
    >
      <div className="cookie-banner-inner">
        <div className="cookie-banner-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
            <path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/>
          </svg>
        </div>
        <p className="cookie-banner-text">
          Este site utiliza cookies para manter sua sessão e melhorar sua experiência.
          Links de afiliados podem usar cookies de rastreamento de terceiros.{" "}
          <Link href="/politica-de-privacidade" className="cookie-banner-link">
            Saiba mais
          </Link>
          .
        </p>
        <button
          type="button"
          className="cookie-banner-btn"
          onClick={accept}
          aria-label="Aceitar uso de cookies e fechar aviso"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
