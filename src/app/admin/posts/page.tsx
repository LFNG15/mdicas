'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAdminPosts } from '@/hooks/useAdminPosts';

export default function AdminPosts() {
  const { allPosts, deletePost, loaded, saving, error } = useAdminPosts();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = allPosts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (slug: string) => {
    await deletePost(slug);
    setConfirmDelete(null);
  };

  const typeLabel = (post: (typeof allPosts)[0]) => {
    if (post.featuredMain) return 'Principal';
    if (post.featured) return 'Destaque';
    return 'Artigo';
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{
            fontSize: '0.7rem', letterSpacing: '0.15em',
            textTransform: 'uppercase' as const, color: 'var(--coral)', fontWeight: 600, marginBottom: '0.4rem',
          }}>
            Gerenciar
          </div>
          <h1 className="admin-h1" style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-dark)',
          }}>
            Artigos
          </h1>
        </div>
        <Link href="/admin/novo" style={{
          padding: '0.75rem 1.5rem', background: 'var(--coral)', color: 'var(--white)',
          borderRadius: 60, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const,
        }}>
          + Novo
        </Link>
      </div>

      {error && (
        <div style={{
          marginBottom: '1rem', padding: '0.9rem 1.2rem',
          background: 'rgba(229,62,62,0.06)', border: '1px solid rgba(229,62,62,0.2)',
          borderRadius: 10, color: '#c53030', fontSize: '0.88rem',
        }}>
          {error}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '1.2rem' }}>
        <input
          type="text"
          placeholder="Buscar por título, categoria ou autor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '0.75rem 1.2rem',
            border: '1.5px solid var(--divider)', borderRadius: 60,
            background: 'var(--white)', fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: '0.88rem', color: 'var(--text-dark)', outline: 'none',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid rgba(240,123,110,0.1)', overflow: 'hidden' }}>

        {/* Desktop header */}
        <div className="admin-table-head" style={{ padding: '0.8rem 1.5rem', borderBottom: '1px solid var(--divider)', background: 'var(--cream)' }}>
          {['Título', 'Categoria', 'Autor', 'Tipo', 'Ações'].map(h => (
            <div key={h} style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--text-light)' }}>
              {h}
            </div>
          ))}
        </div>

        {!loaded && (
          <div style={{ padding: '3rem', textAlign: 'center' as const, color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Carregando...
          </div>
        )}

        {loaded && filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center' as const, color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Nenhum artigo encontrado.
          </div>
        )}

        {loaded && filtered.map((post, i) => (
          <div
            key={post.slug}
            className="admin-table-row"
            style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--divider)' : 'none', opacity: saving ? 0.6 : 1 }}
          >
            {/* Título + data */}
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, marginBottom: '0.2rem',
              }}>
                {post.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const, alignItems: 'center' }}>
                <span>{post.date}</span>
                {/* Categoria e tipo aparecem aqui no mobile, somem no desktop via CSS */}
                <span className="admin-row-mobile-only" style={{
                  padding: '0.15rem 0.55rem', background: 'rgba(240,123,110,0.08)',
                  color: 'var(--coral)', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600,
                }}>
                  {post.category}
                </span>
                <span className="admin-row-mobile-only" style={{ color: 'var(--text-light)' }}>
                  {typeLabel(post)}
                </span>
              </div>
            </div>

            {/* Categoria — só desktop */}
            <div className="admin-row-desktop-only">
              <span style={{
                padding: '0.25rem 0.7rem', background: 'rgba(240,123,110,0.08)',
                color: 'var(--coral)', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em',
              }}>
                {post.category}
              </span>
            </div>

            {/* Autor — só desktop */}
            <div className="admin-row-desktop-only" style={{ fontSize: '0.82rem', color: 'var(--text-mid)' }}>
              {post.author}
            </div>

            {/* Tipo — só desktop */}
            <div className="admin-row-desktop-only" style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
              {typeLabel(post)}
            </div>

            {/* Ações */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' as const, marginTop: 0 }}>
              <Link href={`/artigo/${post.slug}`} style={{
                padding: '0.35rem 0.9rem', border: '1px solid var(--divider)', borderRadius: 20,
                fontSize: '0.75rem', color: 'var(--coral)', textDecoration: 'none', fontWeight: 500,
              }}>
                Ver
              </Link>
              <Link href={`/admin/posts/${post.slug}/editar`} style={{
                padding: '0.35rem 0.9rem', border: '1px solid var(--divider)', borderRadius: 20,
                fontSize: '0.75rem', color: 'var(--text-mid)', textDecoration: 'none', fontWeight: 500,
              }}>
                Editar
              </Link>
              {confirmDelete === post.slug ? (
                <span style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => handleDelete(post.slug)} disabled={saving} style={{
                    fontSize: '0.75rem', color: '#e53e3e', background: 'rgba(229,62,62,0.08)',
                    border: '1px solid rgba(229,62,62,0.2)', borderRadius: 20, cursor: 'pointer',
                    fontWeight: 700, padding: '0.35rem 0.9rem', fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  }}>
                    Confirmar
                  </button>
                  <button onClick={() => setConfirmDelete(null)} style={{
                    fontSize: '0.75rem', color: 'var(--text-light)', background: 'none',
                    border: '1px solid var(--divider)', borderRadius: 20, cursor: 'pointer',
                    padding: '0.35rem 0.9rem', fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  }}>
                    Cancelar
                  </button>
                </span>
              ) : (
                <button onClick={() => setConfirmDelete(post.slug)} disabled={saving} style={{
                  padding: '0.35rem 0.9rem', border: '1px solid var(--divider)', borderRadius: 20,
                  fontSize: '0.75rem', color: 'var(--text-light)', background: 'none',
                  cursor: 'pointer', fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}>
                  Excluir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {loaded && (
        <div style={{ marginTop: '0.8rem', fontSize: '0.78rem', color: 'var(--text-light)' }}>
          {filtered.length} artigo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
