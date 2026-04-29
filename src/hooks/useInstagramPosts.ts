'use client';
import { useState, useEffect, useCallback } from 'react';

export interface InstagramPost {
  id: string;
  url: string;
  image_url: string;
  caption: string;
  created_at: string;
}

export function useInstagramPosts() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/instagram-posts');
      if (!res.ok) throw new Error('Erro ao carregar');
      setPosts(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const addPost = async (data: { url: string; image_url: string; caption: string }) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/instagram-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erro desconhecido');
      await fetchPosts();
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/instagram-posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erro desconhecido');
      await fetchPosts();
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  return { posts, addPost, deletePost, loaded, saving, error };
}
