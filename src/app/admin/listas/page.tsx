'use client';
import { useState } from 'react';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import type { ShoppingList } from '@/hooks/useShoppingLists';

const inp: React.CSSProperties = {
  width: '100%', padding: '0.7rem 1rem',
  border: '1.5px solid var(--divider)', borderRadius: 10,
  background: 'var(--white)', fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
  fontSize: '0.9rem', color: 'var(--text-dark)', outline: 'none',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '0.72rem', fontWeight: 600,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'var(--text-mid)', marginBottom: '0.35rem',
};

export default function AdminListas() {
  const { lists, createList, deleteList, addItem, deleteItem, loaded, saving, error } = useShoppingLists();
  const [newListName, setNewListName] = useState('');
  const [activeList, setActiveList] = useState<ShoppingList | null>(null);
  const [itemForm, setItemForm] = useState({ name: '', affiliate_url: '', image_url: '' });
  const [confirmDeleteList, setConfirmDeleteList] = useState<string | null>(null);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // Sincroniza activeList com dados atualizados
  const currentList = lists.find(l => l.id === activeList?.id) ?? null;

  const handleCreateList = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    try {
      await createList(newListName.trim());
      setNewListName('');
    } catch {}
  };

  const handleAddItem = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!currentList) return;
    if (!itemForm.name.trim() || !itemForm.affiliate_url.trim()) {
      setFormError('Nome e link afiliado são obrigatórios.');
      return;
    }
    setFormError('');
    try {
      await addItem(currentList.id, itemForm);
      setItemForm({ name: '', affiliate_url: '', image_url: '' });
    } catch {}
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--coral)', fontWeight: 600, marginBottom: '0.4rem' }}>
            Curadoria
          </div>
          <h1 className="admin-h1" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            Listas de Compra
          </h1>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '1rem', padding: '0.8rem 1rem', background: 'rgba(229,62,62,0.06)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: 10, color: '#c53030', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }} className="admin-form-grid">

        {/* ── Coluna esquerda: lista de listas ── */}
        <div>
          {/* Criar nova lista */}
          <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid rgba(240,123,110,0.1)', padding: '1.2rem', marginBottom: '1rem' }}>
            <form onSubmit={handleCreateList} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Ex: Melhores fraldas..."
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                style={{ ...inp, flex: 1, padding: '0.6rem 0.9rem' }}
              />
              <button type="submit" disabled={saving} style={{
                padding: '0.6rem 1rem', background: 'var(--coral)', color: 'var(--white)',
                border: 'none', borderRadius: 10, cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' as const,
              }}>
                + Criar
              </button>
            </form>
          </div>

          {/* Listas existentes */}
          <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid rgba(240,123,110,0.1)', overflow: 'hidden' }}>
            {!loaded && <div style={{ padding: '1.5rem', textAlign: 'center' as const, color: 'var(--text-light)', fontSize: '0.85rem' }}>Carregando...</div>}
            {loaded && lists.length === 0 && <div style={{ padding: '1.5rem', textAlign: 'center' as const, color: 'var(--text-light)', fontSize: '0.85rem' }}>Nenhuma lista criada.</div>}
            {lists.map((list, i) => (
              <div key={list.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderBottom: i < lists.length - 1 ? '1px solid var(--divider)' : 'none',
                background: currentList?.id === list.id ? 'rgba(240,123,110,0.06)' : 'transparent',
                cursor: 'pointer',
              }}
                onClick={() => { setActiveList(list); setFormError(''); setItemForm({ name: '', affiliate_url: '', image_url: '' }); }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: currentList?.id === list.id ? 700 : 500, fontSize: '0.88rem', color: 'var(--text-dark)', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentList?.id === list.id && <span style={{ color: 'var(--coral)', marginRight: 6 }}>›</span>}
                    {list.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                    {list.items?.length ?? 0} {list.items?.length === 1 ? 'item' : 'itens'}
                  </div>
                </div>
                {confirmDeleteList === list.id ? (
                  <span style={{ display: 'flex', gap: '0.3rem', flexShrink: 0, marginLeft: '0.5rem' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => { deleteList(list.id); setConfirmDeleteList(null); if (currentList?.id === list.id) setActiveList(null); }}
                      style={{ fontSize: '0.7rem', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, padding: 0, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                      Sim
                    </button>
                    <button onClick={() => setConfirmDeleteList(null)}
                      style={{ fontSize: '0.7rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                      Não
                    </button>
                  </span>
                ) : (
                  <button onClick={e => { e.stopPropagation(); setConfirmDeleteList(list.id); }}
                    style={{ fontSize: '0.7rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem 0.4rem', flexShrink: 0, marginLeft: '0.5rem', fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Coluna direita: itens da lista selecionada ── */}
        <div>
          {!currentList ? (
            <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid rgba(240,123,110,0.1)', padding: '3rem', textAlign: 'center' as const, color: 'var(--text-light)' }}>
              Selecione ou crie uma lista para começar a adicionar itens.
            </div>
          ) : (
            <>
              <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid rgba(240,123,110,0.1)', padding: '1.5rem', marginBottom: '1.2rem' }}>
                <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.2rem' }}>
                  Adicionar item — <em style={{ color: 'var(--coral)' }}>{currentList.name}</em>
                </h2>

                {formError && (
                  <div style={{ marginBottom: '0.8rem', padding: '0.7rem 1rem', background: 'rgba(229,62,62,0.06)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: 10, color: '#c53030', fontSize: '0.82rem' }}>
                    {formError}
                  </div>
                )}

                <form onSubmit={handleAddItem}>
                  <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={lbl}>Nome do produto <span style={{ color: 'var(--coral)' }}>*</span></label>
                      <input type="text" placeholder="Ex: Fralda Pampers Pants G" value={itemForm.name}
                        onChange={e => setItemForm(f => ({ ...f, name: e.target.value }))} style={inp} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>Link afiliado Amazon <span style={{ color: 'var(--coral)' }}>*</span></label>
                      <input type="url" placeholder="https://amzn.to/..." value={itemForm.affiliate_url}
                        onChange={e => setItemForm(f => ({ ...f, affiliate_url: e.target.value }))} style={inp} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>URL da imagem (opcional)</label>
                      <input type="url" placeholder="https://... (link da imagem do produto)" value={itemForm.image_url}
                        onChange={e => setItemForm(f => ({ ...f, image_url: e.target.value }))} style={inp} />
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                        Cole o link da imagem do produto na Amazon ou outro serviço de imagens.
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={saving} style={{
                    marginTop: '1rem', padding: '0.7rem 1.8rem', background: saving ? 'var(--text-light)' : 'var(--coral)',
                    color: 'var(--white)', border: 'none', borderRadius: 60,
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 600,
                    letterSpacing: '0.05em', textTransform: 'uppercase' as const, cursor: saving ? 'not-allowed' : 'pointer',
                  }}>
                    {saving ? 'Salvando...' : '+ Adicionar item'}
                  </button>
                </form>
              </div>

              {/* Itens da lista */}
              <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid rgba(240,123,110,0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--divider)', background: 'var(--cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-light)' }}>
                    {currentList.items?.length ?? 0} {currentList.items?.length === 1 ? 'item' : 'itens'} na lista
                  </span>
                </div>

                {(!currentList.items || currentList.items.length === 0) && (
                  <div style={{ padding: '2rem', textAlign: 'center' as const, color: 'var(--text-light)', fontSize: '0.85rem' }}>
                    Nenhum item ainda. Adicione o primeiro acima.
                  </div>
                )}

                {currentList.items?.map((item, i) => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 1.2rem',
                    borderBottom: i < (currentList.items?.length ?? 0) - 1 ? '1px solid var(--divider)' : 'none',
                    opacity: saving ? 0.6 : 1,
                  }}>
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--divider)', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-dark)', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.2rem', flexWrap: 'wrap' as const }}>
                        <a href={item.affiliate_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: 'var(--text-light)', textDecoration: 'none' }}>
                          Ver na Amazon ↗
                        </a>
                      </div>
                    </div>
                    {confirmDeleteItem === item.id ? (
                      <span style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                        <button onClick={() => { deleteItem(currentList.id, item.id); setConfirmDeleteItem(null); }}
                          style={{ fontSize: '0.72rem', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, padding: 0, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                          Sim
                        </button>
                        <button onClick={() => setConfirmDeleteItem(null)}
                          style={{ fontSize: '0.72rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                          Não
                        </button>
                      </span>
                    ) : (
                      <button onClick={() => setConfirmDeleteItem(item.id)} style={{ fontSize: '0.72rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', flexShrink: 0, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
