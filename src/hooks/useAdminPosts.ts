'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Post } from '@/lib/supabase/types';

export type { Post };

export function useAdminPosts() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erro ao carregar artigos');
      setAllPosts(await res.json());
    } catch (e: any) {
      setError('Erro ao carregar artigos: ' + e.message);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const createPost = async (post: Post) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erro desconhecido');
      await fetchPosts();
    } catch (e: any) {
      setError('Erro ao criar artigo: ' + e.message);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const updatePost = async (post: Post) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(post.id!)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erro desconhecido');
      await fetchPosts();
    } catch (e: any) {
      setError('Erro ao salvar artigo: ' + e.message);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (slug: string) => {
    setSaving(true);
    setError(null);
    try {
      const id = allPosts.find(p => p.slug === slug)?.id;
      if (!id) throw new Error('Post não encontrado');
      const res = await fetch(`/api/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erro desconhecido');
      await fetchPosts();
    } catch (e: any) {
      setError('Erro ao excluir artigo: ' + e.message);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  return { allPosts, createPost, updatePost, deletePost, loaded, saving, error };
}
