'use client';
import PostForm from '@/components/admin/PostForm';
import { useAdminPosts } from '@/hooks/useAdminPosts';
import type { Post as SanityPost } from '@/lib/supabase/types';

export default function EditarArtigoClient({ slug }: { slug: string }) {
  const { allPosts, updatePost, loaded, saving } = useAdminPosts();

  const post = allPosts.find(p => p.slug === slug);

  if (!loaded) {
    return (
      <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', padding: '2rem' }}>
        Carregando...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ color: '#c53030', fontSize: '0.9rem' }}>Artigo não encontrado.</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          color: 'var(--coral)',
          fontWeight: 600,
          marginBottom: '0.4rem',
        }}>
          Editar
        </div>
        <h1 style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontSize: '2.2rem',
          fontWeight: 700,
          color: 'var(--text-dark)',
          maxWidth: 680,
          lineHeight: 1.2,
        }}>
          {post.title}
        </h1>
      </div>

      <div style={{
        background: 'var(--white)',
        borderRadius: 16,
        border: '1px solid rgba(240,123,110,0.1)',
        padding: '2.5rem',
      }}>
        <PostForm
          initial={post}
          onSubmit={(updated: SanityPost) => updatePost(updated)}
          submitLabel="Salvar Alterações"
          saving={saving}
        />
      </div>
    </div>
  );
}
