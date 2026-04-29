'use client';
import { useState, useRef } from 'react';
import { useInstagramPosts } from '@/hooks/useInstagramPosts';
import { createClient } from '@/utils/supabase/client';

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  border: '1.5px solid var(--divider)',
  borderRadius: 10,
  background: 'var(--white)',
  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
  fontSize: '0.9rem',
  color: 'var(--text-dark)',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-mid)',
  marginBottom: '0.4rem',
};

export default function AdminInstagram() {
  const { posts, addPost, deletePost, loaded, saving, error } = useInstagramPosts();
  const [form, setForm] = useState({ url: '', caption: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.url) { setFormError('Cole o link do post no Instagram.'); return; }
    if (!imageFile) { setFormError('Selecione uma imagem para o post.'); return; }
    setFormError('');
    setUploading(true);

    try {
      // 1. Faz upload da imagem para o Supabase Storage
      const supabase = createClient();
      const ext = imageFile.name.split('.').pop();
      const filename = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('instagram')
        .upload(filename, imageFile, { upsert: false });

      if (uploadError) throw new Error('Erro no upload: ' + uploadError.message);

      // 2. Gera URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('instagram')
        .getPublicUrl(filename);

      // 3. Salva o post
      await addPost({ url: form.url, image_url: publicUrl, caption: form.caption });

      setForm({ url: '', caption: '' });
      setImageFile(null);
      setImagePreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setFormError(err.message ?? 'Erro ao salvar.');
    } finally {
      setUploading(false);
    }
  };

  const isBusy = saving || uploading;

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--coral)', fontWeight: 600, marginBottom: '0.4rem' }}>
            Instagram
          </div>
          <h1 className="admin-h1" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            Posts do Instagram
          </h1>
        </div>
      </div>

      {/* Form */}
      <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid rgba(240,123,110,0.1)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.2rem' }}>
          Adicionar novo post
        </h2>

        {(formError || error) && (
          <div style={{ marginBottom: '1rem', padding: '0.8rem 1rem', background: 'rgba(229,62,62,0.06)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: 10, color: '#c53030', fontSize: '0.85rem' }}>
            {formError || error}
          </div>
        )}

        <form onSubmit={handleAdd}>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

            {/* Link do post */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Link do post no Instagram <span style={{ color: 'var(--coral)' }}>*</span></label>
              <input
                type="url"
                placeholder="https://www.instagram.com/p/..."
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                style={inputStyle}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.3rem' }}>
                Abra o post no Instagram → clique nos 3 pontinhos → "Copiar link"
              </div>
            </div>

            {/* Upload da imagem */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Imagem do post <span style={{ color: 'var(--coral)' }}>*</span></label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* Drop zone */}
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: 120, height: 120, borderRadius: 12,
                  border: '2px dashed var(--divider)', cursor: 'pointer',
                  background: imagePreview ? 'transparent' : 'rgba(240,123,110,0.03)',
                  overflow: 'hidden', flexShrink: 0, position: 'relative',
                  transition: 'border-color 0.2s',
                }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.4rem', textAlign: 'center' }}>Selecionar imagem</span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                </label>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.6, margin: 0 }}>
                    Salve a foto do post direto do Instagram no seu dispositivo e selecione ela aqui.
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                    No Instagram: toque nos 3 pontinhos do post → "Salvar" ou tire um screenshot.
                  </p>
                  {imageFile && (
                    <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--coral)', fontWeight: 600 }}>✓ {imageFile.name}</span>
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        style={{ fontSize: '0.72rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Remover
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Legenda */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Legenda <span style={{ fontSize: '0.7em', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span></label>
              <input
                type="text"
                placeholder="Breve descrição do post..."
                value={form.caption}
                onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.2rem' }}>
            <button
              type="submit"
              disabled={isBusy}
              style={{
                padding: '0.75rem 2rem', background: isBusy ? 'var(--text-light)' : 'var(--coral)',
                color: 'var(--white)', border: 'none', borderRadius: 60,
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const, cursor: isBusy ? 'not-allowed' : 'pointer',
              }}
            >
              {uploading ? 'Enviando imagem...' : saving ? 'Salvando...' : '+ Publicar no site'}
            </button>
          </div>
        </form>
      </div>

      {/* Posts grid */}
      <div>
        <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>
          Posts publicados ({loaded ? posts.length : '…'})
        </h2>

        {!loaded && (
          <div style={{ padding: '2rem', textAlign: 'center' as const, color: 'var(--text-light)' }}>Carregando...</div>
        )}

        {loaded && posts.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center' as const, color: 'var(--text-light)', background: 'var(--white)', borderRadius: 16, border: '1px solid rgba(240,123,110,0.1)' }}>
            Nenhum post adicionado ainda.
          </div>
        )}

        <div className="ig-admin-grid">
          {posts.map(post => (
            <div key={post.id} style={{ background: 'var(--white)', borderRadius: 12, border: '1px solid rgba(240,123,110,0.1)', overflow: 'hidden', opacity: isBusy ? 0.6 : 1 }}>
              <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', position: 'relative', paddingBottom: '100%' }}>
                <img
                  src={post.image_url}
                  alt={post.caption || 'Post Instagram'}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </a>
              <div style={{ padding: '0.75rem 1rem' }}>
                {post.caption && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-mid)', marginBottom: '0.6rem', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                    {post.caption}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: 'var(--coral)', fontWeight: 600, textDecoration: 'none' }}>
                    Ver no Instagram ↗
                  </a>
                  <span style={{ color: 'var(--divider)' }}>·</span>
                  {confirmDelete === post.id ? (
                    <span style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => { deletePost(post.id); setConfirmDelete(null); }}
                        style={{ fontSize: '0.72rem', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, padding: 0, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                        Sim
                      </button>
                      <button onClick={() => setConfirmDelete(null)}
                        style={{ fontSize: '0.72rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                        Não
                      </button>
                    </span>
                  ) : (
                    <button onClick={() => setConfirmDelete(post.id)}
                      style={{ fontSize: '0.72rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                      Remover
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
