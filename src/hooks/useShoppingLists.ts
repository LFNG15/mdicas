'use client';
import { useState, useEffect, useCallback } from 'react';

export interface ShoppingListItem {
  id: string;
  list_id: string;
  name: string;
  affiliate_url: string;
  image_url: string;
  price?: string;
  position: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  created_at: string;
  items?: ShoppingListItem[];
}

export function useShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    try {
      const res = await fetch('/api/shopping-lists');
      if (!res.ok) throw new Error('Erro ao carregar listas');
      setLists(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { fetchLists(); }, [fetchLists]);

  const createList = async (name: string) => {
    setSaving(true); setError(null);
    try {
      const res = await fetch('/api/shopping-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchLists();
      return (await res.clone().json()) as ShoppingList;
    } catch (e: any) { setError(e.message); throw e; }
    finally { setSaving(false); }
  };

  const deleteList = async (id: string) => {
    setSaving(true); setError(null);
    try {
      const res = await fetch(`/api/shopping-lists/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchLists();
    } catch (e: any) { setError(e.message); throw e; }
    finally { setSaving(false); }
  };

  const addItem = async (listId: string, item: Omit<ShoppingListItem, 'id' | 'list_id' | 'position'>) => {
    setSaving(true); setError(null);
    try {
      const res = await fetch(`/api/shopping-lists/${listId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchLists();
    } catch (e: any) { setError(e.message); throw e; }
    finally { setSaving(false); }
  };

  const deleteItem = async (listId: string, itemId: string) => {
    setSaving(true); setError(null);
    try {
      const res = await fetch(`/api/shopping-lists/${listId}/items/${itemId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchLists();
    } catch (e: any) { setError(e.message); throw e; }
    finally { setSaving(false); }
  };

  return { lists, createList, deleteList, addItem, deleteItem, loaded, saving, error };
}
