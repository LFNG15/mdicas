"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [searchOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/artigos?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`} aria-label="Navegação principal">
      <a href="#main" className="skip-link">Pular para o conteúdo principal</a>
      <div className="nav-inner">
        <Link href="/" className="nav-logo" aria-label="MD - Página inicial">
          <span className="nav-logo-letters" aria-hidden="true">
            M<span className="divider-line"></span>D
          </span>
        </Link>
        <ul
          className={`nav-links${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <li><Link href="/">Início</Link></li>
          <li><Link href="/artigos">Artigos</Link></li>
          <li><Link href="/listas">Listas<span className="divider-line" aria-hidden="true"></span>Dicas</Link></li>
          <li><Link href="/#grupos">Entre em nossos Grupos</Link></li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
          <div className="nav-search-wrap" ref={searchWrapRef}>
            <button
              type="button"
              className="nav-search"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={searchOpen ? "Fechar busca" : "Abrir busca de artigos"}
              aria-expanded={searchOpen}
              aria-controls="nav-search-popover"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            {searchOpen && (
              <form
                id="nav-search-popover"
                className="nav-search-popover"
                role="search"
                onSubmit={submitSearch}
              >
                <label htmlFor="nav-search-input" className="visually-hidden">
                  Buscar artigos
                </label>
                <input
                  id="nav-search-input"
                  ref={searchInputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar artigos..."
                  autoComplete="off"
                  enterKeyHint="search"
                />
                <button type="submit" aria-label="Buscar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </form>
            )}
          </div>
          <button
            type="button"
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
