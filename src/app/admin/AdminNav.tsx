"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const icons: Record<string, React.ReactNode> = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  artigos: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  novo: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  ),
  listas: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  grupos: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

const links = [
  { href: "/admin",            label: "Dashboard",       icon: icons.dashboard },
  { href: "/admin/posts",      label: "Artigos",         icon: icons.artigos   },
  { href: "/admin/novo",       label: "Novo Artigo",     icon: icons.novo      },
  { href: "/admin/instagram",  label: "Instagram",       icon: icons.instagram },
  { href: "/admin/listas",     label: "Listas de Compra",icon: icons.listas    },
  { href: "/admin/grupos",     label: "Grupos de Ofertas",icon: icons.grupos   },
];

export default function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: "0.3rem", flex: 1 }}>
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.7rem 1rem",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "0.88rem",
              fontWeight: active ? 600 : 400,
              color: active ? "var(--white)" : "rgba(255,255,255,0.45)",
              background: active ? "rgba(240,123,110,0.18)" : "transparent",
              transition: "all 0.2s",
              borderLeft: active ? "2px solid var(--coral)" : "2px solid transparent",
            }}
          >
            <span style={{ lineHeight: 0 }}>{link.icon}</span>
            {link.label}
          </Link>
        );
      })}

      <Link
        href="/"
        onClick={onNavigate}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "1rem 1rem 0.7rem",
          borderRadius: "10px",
          textDecoration: "none",
          fontSize: "0.88rem",
          fontWeight: 400,
          color: "rgba(255,255,255,0.45)",
          background: "transparent",
          transition: "all 0.2s",
          borderLeft: "2px solid transparent",
          marginTop: "0.5rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ lineHeight: 0 }}>{icons.home}</span>
        Ir para o Site
      </Link>
    </nav>
  );
}
