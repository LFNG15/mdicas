"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  href: string;
  label: string;
  icon: "home" | "book" | "cart" | "chat";
  matcher: (pathname: string) => boolean;
};

const items: Item[] = [
  {
    href: "/",
    label: "Início",
    icon: "home",
    matcher: (p) => p === "/",
  },
  {
    href: "/artigos",
    label: "Artigos",
    icon: "book",
    matcher: (p) => p.startsWith("/artigo") || p.startsWith("/categoria"),
  },
  {
    href: "/listas",
    label: "Listas",
    icon: "cart",
    matcher: (p) => p.startsWith("/listas"),
  },
  {
    href: "/#grupos",
    label: "Grupos",
    icon: "chat",
    matcher: () => false,
  },
];

function Icon({ name, active }: { name: Item["icon"]; active: boolean }) {
  const stroke = active ? 2 : 1.7;
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "home":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M3 9.6 12 3l9 6.6V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.6z" />
        </svg>
      );
    case "book":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="9" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.5 3h2.6l2.4 12.1a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.5L22 7H6.4" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
        </svg>
      );
  }
}

export default function BottomNav() {
  const pathname = usePathname() ?? "/";
  if (pathname.startsWith("/admin") || pathname === "/login") return null;

  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {items.map((item) => {
        const active = item.matcher(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item${active ? " active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <Icon name={item.icon} active={active} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
