'use client';
import PostForm from '@/components/admin/PostForm';
import { useAdminPosts } from '@/hooks/useAdminPosts';
import type { Post } from '@/lib/supabase/types';

export default function NovoArtigo() {
  const { createPost, saving } = useAdminPosts();

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
          Criar
        </div>
        <h1 style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontSize: '2.2rem',
          fontWeight: 700,
          color: 'var(--text-dark)',
        }}>
          Novo Artigo
        </h1>
      </div>

      <div style={{
        background: 'var(--white)',
        borderRadius: 16,
        border: '1px solid rgba(240,123,110,0.1)',
        padding: '2.5rem',
      }}>
        <PostForm
          onSubmit={(post: Post) => createPost(post)}
          submitLabel="Publicar Artigo"
          saving={saving}
        />
      </div>
    </div>
  );
}
