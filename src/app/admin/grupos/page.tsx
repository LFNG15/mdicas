'use client';
import { useState, useEffect, useCallback } from 'react';

interface Grupo {
  id: string;
  platform: 'whatsapp' | 'telegram';
  name: string;
  url: string;
  created_at: string;
}

const PLATFORMS = [
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    color: '#25D366',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    value: 'telegram',
    label: 'Telegram',
    color: '#229ED9',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
];

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

export default function AdminGrupos() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ platform: 'whatsapp', name: '', url: '' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchGrupos = useCallback(async () => {
    try {
      const res = await fetch('/api/grupos-ofertas');
      setGrupos(await res.json());
    } catch { setError('Erro ao carregar grupos.'); }
    finally { setLoaded(true); }
  }, []);

  useEffect(() => { fetchGrupos(); }, [fetchGrupos]);

  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) { setError('Nome e link são obrigatórios.'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/grupos-ofertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchGrupos();
      setForm({ platform: 'whatsapp', name: '', url: '' });
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await fetch(`/api/grupos-ofertas/${id}`, { method: 'DELETE' });
      await fetchGrupos();
      setConfirmDelete(null);
    } catch { setError('Erro ao remover.'); }
    finally { setSaving(false); }
  };

  const getPlatform = (val: string) => PLATFORMS.find(p => p.value === val) ?? PLATFORMS[0];

  return (
    <div>
      <div className="admin-page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--coral)', fontWeight: 600, marginBottom: '0.4rem' }}>
            Comunidade
          </div>
          <h1 className="admin-h1" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            Grupos de Ofertas
          </h1>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '1rem', padding: '0.8rem 1rem', background: 'rgba(229,62,62,0.06)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: 10, color: '#c53030', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Formulário */}
      <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid rgba(240,123,110,0.1)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.2rem' }}>
          Adicionar grupo
        </h2>

        <form onSubmit={handleAdd}>
          {/* Seleção de plataforma */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Plataforma <span style={{ color: 'var(--coral)' }}>*</span></label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {PLATFORMS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, platform: p.value }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.2rem', borderRadius: 10, cursor: 'pointer',
                    border: form.platform === p.value ? `2px solid ${p.color}` : '2px solid var(--divider)',
                    background: form.platform === p.value ? `${p.color}12` : 'var(--white)',
                    color: form.platform === p.value ? p.color : 'var(--text-mid)',
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 600,
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ color: p.color }}>{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div>
              <label style={lbl}>Nome do grupo <span style={{ color: 'var(--coral)' }}>*</span></label>
              <input type="text" placeholder="Ex: Ofertas do Dia" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} />
            </div>
            <div>
              <label style={lbl}>Link do grupo <span style={{ color: 'var(--coral)' }}>*</span></label>
              <input type="url"
                placeholder={form.platform === 'whatsapp' ? 'https://chat.whatsapp.com/...' : 'https://t.me/...'}
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))} style={inp} />
            </div>
          </div>

          <button type="submit" disabled={saving} style={{
            marginTop: '1rem', padding: '0.7rem 1.8rem',
            background: saving ? 'var(--text-light)' : 'var(--coral)',
            color: 'var(--white)', border: 'none', borderRadius: 60,
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 600,
            letterSpacing: '0.05em', textTransform: 'uppercase' as const,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}>
            {saving ? 'Salvando...' : '+ Adicionar grupo'}
          </button>
        </form>
      </div>

      {/* Lista de grupos */}
      <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid rgba(240,123,110,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--divider)', background: 'var(--cream)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-light)' }}>
            {loaded ? `${grupos.length} grupo${grupos.length !== 1 ? 's' : ''} ativo${grupos.length !== 1 ? 's' : ''}` : 'Carregando...'}
          </span>
        </div>

        {loaded && grupos.length === 0 && (
          <div style={{ padding: '2.5rem', textAlign: 'center' as const, color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Nenhum grupo adicionado ainda.
          </div>
        )}

        {grupos.map((grupo, i) => {
          const plat = getPlatform(grupo.platform);
          return (
            <div key={grupo.id} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.5rem',
              borderBottom: i < grupos.length - 1 ? '1px solid var(--divider)' : 'none',
              opacity: saving ? 0.6 : 1,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: `${plat.color}15`, color: plat.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {plat.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                  {grupo.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: plat.color, fontWeight: 600 }}>{plat.label}</span>
                  <span>·</span>
                  <a href={grupo.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>
                    {grupo.url.length > 45 ? grupo.url.slice(0, 45) + '…' : grupo.url}
                  </a>
                </div>
              </div>
              {confirmDelete === grupo.id ? (
                <span style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => handleDelete(grupo.id)} style={{ fontSize: '0.75rem', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, padding: 0, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                    Sim
                  </button>
                  <button onClick={() => setConfirmDelete(null)} style={{ fontSize: '0.75rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                    Não
                  </button>
                </span>
              ) : (
                <button onClick={() => setConfirmDelete(grupo.id)} style={{ fontSize: '0.72rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', flexShrink: 0, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                  Remover
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
