'use client';
import { useState } from 'react';
import Link from 'next/link';
import AdminNav from './AdminNav';
import LogoutButton from './LogoutButton';

export default function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--cream)', overflowX: 'hidden' }}>
      {/* Mobile overlay */}
      {open && (
        <div className="admin-overlay" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar${open ? ' open' : ''}`}>
        <div style={{ marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: '1.7rem',
              fontWeight: 700,
              color: 'var(--coral)',
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}
          >
            MD
          </Link>
          <div style={{
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginTop: '0.25rem',
            fontWeight: 600,
          }}>
            Painel Admin
          </div>
        </div>

        <AdminNav onNavigate={() => setOpen(false)} />

        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: '1.5rem',
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '0.8rem',
            paddingLeft: '0.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {email}
          </div>
            <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {/* Mobile header */}
        <div className="admin-mobile-header">
          <button
            onClick={() => setOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.4rem',
              color: 'var(--text-dark)',
              lineHeight: 1,
              padding: '0.2rem',
            }}
          >
            ☰
          </button>
          <span style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: '1.3rem',
            fontWeight: 700,
            color: 'var(--coral)',
          }}>
            MD Admin
          </span>
          <Link href="/admin/novo" style={{
            padding: '0.45rem 1rem',
            background: 'var(--coral)',
            color: 'var(--white)',
            borderRadius: 60,
            textDecoration: 'none',
            fontSize: '0.78rem',
            fontWeight: 600,
          }}>
            + Novo
          </Link>
        </div>

        <div className="admin-main-inner">
          {children}
        </div>
      </main>
    </div>
  );
}
