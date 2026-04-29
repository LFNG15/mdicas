"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-letters">
            M<span className="divider-line"></span>D
          </span>
        </Link>
        <ul className={`nav-links${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)}>
          <li><Link href="/">Início</Link></li>
          <li><Link href="/artigos">Artigos</Link></li>
          <li><Link href="/listas">Listas<span className="divider-line"></span>Dicas</Link></li>
          <li><Link href="/#grupos">Entre em nossos Grupos</Link></li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
          <button className="nav-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
