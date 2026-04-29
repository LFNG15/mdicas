'use client';
import Link from 'next/link';
import { useAdminPosts } from '@/hooks/useAdminPosts';

const cardStyle = {
  background: 'var(--white)',
  borderRadius: 16,
  border: '1px solid rgba(240,123,110,0.1)',
  overflow: 'hidden' as const,
};

export default function AdminDashboard() {
  const { allPosts, loaded } = useAdminPosts();
  const featured = allPosts.filter(p => p.featured).length;
  const recent = allPosts.slice(0, 6);

  return (
    <div>
      <div className="admin-page-title" style={{ marginBottom: '2rem' }}>
        <div style={{
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          color: 'var(--coral)',
          fontWeight: 600,
          marginBottom: '0.4rem',
        }}>
          Bem-vindo
        </div>
        <h1 className="admin-h1" style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontSize: '2.2rem',
          fontWeight: 700,
          color: 'var(--text-dark)',
        }}>
          Dashboard
        </h1>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ display: 'grid', marginBottom: '2rem' }}>
        {[
          { label: 'Total de Artigos', value: loaded ? allPosts.length : '—', href: '/admin/posts', color: 'var(--coral)' },
          { label: 'Em Destaque', value: loaded ? featured : '—', href: '/admin/posts', color: 'var(--coral-dark)' },
          { label: 'Publicar Novo', value: '+', href: '/admin/novo', color: 'var(--coral-light)' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
            <div style={{
              ...cardStyle,
              padding: '2rem',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(240,123,110,0.1)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'none';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: '2.8rem',
                fontWeight: 800,
                color: stat.color,
                lineHeight: 1,
                marginBottom: '0.6rem',
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="admin-quick-actions">
        <Link href="/admin/novo" style={{
          padding: '0.75rem 1.8rem',
          background: 'var(--coral)',
          color: 'var(--white)',
          borderRadius: 60,
          textDecoration: 'none',
          fontSize: '0.82rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          transition: 'all 0.2s',
        }}>
          + Novo Artigo
        </Link>
        <Link href="/admin/posts" style={{
          padding: '0.75rem 1.8rem',
          background: 'transparent',
          color: 'var(--text-mid)',
          border: '1.5px solid var(--divider)',
          borderRadius: 60,
          textDecoration: 'none',
          fontSize: '0.82rem',
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
        }}>
          Gerenciar Artigos
        </Link>
      </div>

      {/* Recent posts */}
      <div style={cardStyle}>
        <div style={{
          padding: '1.4rem 2rem',
          borderBottom: '1px solid var(--divider)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            Artigos Recentes
          </h2>
          <Link href="/admin/posts" style={{ fontSize: '0.78rem', color: 'var(--coral)', textDecoration: 'none', fontWeight: 600 }}>
            Ver todos →
          </Link>
        </div>

        {recent.map((post, i) => (
          <div key={post.slug} className="admin-recent-row" style={{
            borderBottom: i < recent.length - 1 ? '1px solid var(--divider)' : 'none',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--text-dark)',
                marginBottom: '0.2rem',
                whiteSpace: 'nowrap' as const,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {post.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                {post.category} · {post.date}
                {post.featured && (
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.15rem 0.5rem',
                    background: 'rgba(240,123,110,0.1)',
                    color: 'var(--coral)',
                    borderRadius: 20,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase' as const,
                  }}>
                    Destaque
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexShrink: 0, marginLeft: '1rem' }}>
              <Link href={`/artigo/${post.slug}`} style={{ fontSize: '0.75rem', color: 'var(--coral)', textDecoration: 'none', fontWeight: 500 }}>
                Ver
              </Link>
              <Link href={`/admin/posts/${post.slug}/editar`} style={{ fontSize: '0.75rem', color: 'var(--text-light)', textDecoration: 'none', fontWeight: 500 }}>
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
