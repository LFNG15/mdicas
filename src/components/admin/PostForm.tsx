'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/lib/supabase/types';
import RichTextEditor from './RichTextEditor';

const GRADIENTS = [
  { label: 'Coral → Escuro', value: 'linear-gradient(135deg, #F07B6E 0%, #D9685C 100%)' },
  { label: 'Escuro → Coral', value: 'linear-gradient(135deg, #D9685C 0%, #F07B6E 100%)' },
  { label: 'Claro → Coral', value: 'linear-gradient(135deg, #F5A49B 0%, #F07B6E 100%)' },
  { label: 'Coral → Claro', value: 'linear-gradient(135deg, #F07B6E 0%, #F5A49B 100%)' },
  { label: 'Claro → Creme', value: 'linear-gradient(135deg, #F5A49B 0%, #FAF3EF 100%)' },
];

const empty: Post = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  category: '',
  tag: '',
  author: '',
  date: '',
  readTime: '',
  gradient: GRADIENTS[0].value,
  featured: false,
  featuredMain: false,
};

function toSlug(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const labelStyle = (text: string, required?: boolean) => (
  <label style={{
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--text-mid)',
    marginBottom: '0.4rem',
  }}>
    {text}{required && <span style={{ color: 'var(--coral)', marginLeft: 3 }}>*</span>}
  </label>
);

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  border: '1.5px solid var(--divider)',
  borderRadius: 10,
  background: 'var(--white)',
  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
  fontSize: '0.92rem',
  color: 'var(--text-dark)',
  outline: 'none',
  transition: 'border 0.2s',
};

interface Props {
  initial?: Post;
  onSubmit: (post: Post) => Promise<void>;
  submitLabel?: string;
  saving?: boolean;
}

export default function PostForm({ initial, onSubmit, submitLabel = 'Publicar Artigo', saving }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Post>(initial ?? empty);
  const [slugEdited, setSlugEdited] = useState(!!initial);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slugEdited && form.title) {
      setForm((f: Post) => ({ ...f, slug: toSlug(f.title) }));
    }
  }, [form.title, slugEdited]);

  const set = (key: keyof Post, val: string | boolean) =>
    setForm((f: Post) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.slug || !form.title || !form.excerpt || !form.content) {
      setError('Preencha os campos obrigatórios: título, slug, resumo e conteúdo.');
      return;
    }
    setError('');
    try {
      await onSubmit(form);
      router.push('/admin/posts');
    } catch {
      setError('Erro ao salvar. Verifique o console.');
    }
  };

  const field = (
    key: keyof Post,
    labelText: string,
    opts?: { required?: boolean; placeholder?: string; hint?: string }
  ) => (
    <div style={{ marginBottom: '1.5rem' }}>
      {labelStyle(labelText, opts?.required)}
      {opts?.hint && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.4rem' }}>{opts.hint}</div>
      )}
      <input
        type="text"
        value={form[key] as string}
        placeholder={opts?.placeholder}
        onChange={e => {
          if (key === 'slug') setSlugEdited(true);
          set(key, e.target.value);
        }}
        style={inputStyle}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '0.9rem 1.2rem',
          background: 'rgba(229,62,62,0.06)',
          border: '1px solid rgba(229,62,62,0.2)',
          borderRadius: 10,
          color: '#c53030',
          fontSize: '0.88rem',
        }}>
          {error}
        </div>
      )}

      <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          {field('title', 'Título', { required: true, placeholder: 'Ex: Como criar hábitos financeiros saudáveis' })}
        </div>
        <div>
          {field('slug', 'Slug (URL)', {
            required: true,
            placeholder: 'ex: habitos-financeiros',
            hint: 'Gerado automaticamente a partir do título. Edite se necessário.',
          })}
        </div>
        <div>
          {field('author', 'Autor', { required: true, placeholder: 'Ex: Ana Oliveira' })}
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          {field('excerpt', 'Resumo', { required: true, placeholder: 'Um parágrafo curto que aparece na listagem...' })}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        {labelStyle('Conteúdo', true)}
        <RichTextEditor
          value={form.content as string}
          onChange={html => set('content', html)}
        />
      </div>

      <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
        <div>{field('category', 'Categoria', { placeholder: 'Ex: Finanças, Lifestyle, Tecnologia' })}</div>
        <div>{field('tag', 'Tag', { placeholder: 'Ex: Economia, Bem-Estar' })}</div>
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            {labelStyle('Data de publicação')}
            <input
              type="text"
              value={
                form.date && /^\d{4}-\d{2}-\d{2}$/.test(form.date)
                  ? form.date.split('-').reverse().join('/')
                  : form.date
              }
              placeholder="DD/MM/AAAA"
              maxLength={10}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
                let display = raw;
                if (raw.length > 4) display = raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4);
                else if (raw.length > 2) display = raw.slice(0, 2) + '/' + raw.slice(2);
                e.target.value = display;
                if (raw.length === 8) {
                  const iso = `${raw.slice(4)}-${raw.slice(2, 4)}-${raw.slice(0, 2)}`;
                  set('date', iso);
                } else {
                  set('date', display);
                }
              }}
              style={inputStyle}
            />
          </div>
        </div>
        <div>{field('readTime', 'Tempo de leitura', { placeholder: 'Ex: 5 min de leitura' })}</div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        {labelStyle('Gradiente do card')}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const }}>
          {GRADIENTS.map(g => (
            <button
              key={g.value}
              type="button"
              onClick={() => set('gradient', g.value)}
              title={g.label}
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: g.value,
                border: form.gradient === g.value ? '3px solid var(--text-dark)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'border 0.2s',
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <input
            type="text"
            value={form.gradient}
            onChange={e => set('gradient', e.target.value)}
            placeholder="Ou insira um CSS gradient customizado"
            style={{ ...inputStyle, fontSize: '0.8rem', fontFamily: 'monospace' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        {([
          { key: 'featured', label: 'Artigo em Destaque' },
          { key: 'featuredMain', label: 'Destaque Principal (hero)' },
        ] as const).map(({ key, label: lbl }) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={!!form[key]}
              onChange={e => set(key, e.target.checked)}
              style={{ accentColor: 'var(--coral)', width: 16, height: 16 }}
            />
            <span style={{ fontSize: '0.88rem', color: 'var(--text-mid)', fontWeight: 500 }}>{lbl}</span>
          </label>
        ))}
      </div>

      {form.gradient && (
        <div style={{ marginBottom: '2rem' }}>
          {labelStyle('Prévia do card')}
          <div style={{
            height: 80,
            borderRadius: 12,
            background: form.gradient,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '1.5rem',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: '1rem', fontWeight: 700 }}>
              {form.title || 'Título do artigo'}
            </span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '0.85rem 2.5rem',
            background: saving ? 'var(--text-light)' : 'var(--coral)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: 60,
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {saving ? 'Salvando...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={saving}
          style={{
            padding: '0.85rem 1.8rem',
            background: 'transparent',
            color: 'var(--text-mid)',
            border: '1.5px solid var(--divider)',
            borderRadius: 60,
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: '0.85rem',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
