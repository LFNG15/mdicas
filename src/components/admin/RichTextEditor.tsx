'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import { useEffect } from 'react';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const btnBase: React.CSSProperties = {
  padding: '0.3rem 0.6rem',
  border: '1.5px solid var(--divider)',
  borderRadius: 6,
  background: 'var(--white)',
  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
  fontSize: '0.8rem',
  fontWeight: 600,
  cursor: 'pointer',
  color: 'var(--text-dark)',
  transition: 'all 0.15s',
  lineHeight: 1,
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: 'var(--coral)',
  color: '#fff',
  borderColor: 'var(--coral)',
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Escreva o conteúdo do artigo aqui...' }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        style: [
          'min-height:320px',
          'padding:1rem 1.2rem',
          'outline:none',
          "font-family:'DM Sans',sans-serif",
          'font-size:0.95rem',
          'line-height:1.8',
          'color:var(--text-dark)',
        ].join(';'),
      },
    },
  });

  // Sync external value changes (e.g. when editing an existing post)
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const addYoutube = () => {
    const url = window.prompt('Cole o link do vídeo do YouTube:');
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt('URL do link:');
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  const ToolBtn = ({
    label,
    title,
    active,
    onClick,
  }: {
    label: string;
    title: string;
    active?: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={active ? btnActive : btnBase}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        border: '1.5px solid var(--divider)',
        borderRadius: 10,
        overflow: 'hidden',
        background: 'var(--white)',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          padding: '0.6rem 0.8rem',
          borderBottom: '1.5px solid var(--divider)',
          background: '#fafafa',
        }}
      >
        <ToolBtn label="N" title="Normal" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()} />
        <ToolBtn label="T2" title="Título 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolBtn label="T3" title="Título 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />

        <span style={{ width: 1, background: 'var(--divider)', margin: '0 0.2rem', alignSelf: 'stretch' }} />

        <ToolBtn label="B" title="Negrito" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolBtn label="I" title="Itálico" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />

        <span style={{ width: 1, background: 'var(--divider)', margin: '0 0.2rem', alignSelf: 'stretch' }} />

        <ToolBtn label="• Lista" title="Lista com marcadores" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolBtn label="1. Lista" title="Lista numerada" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <ToolBtn label={'" "'} title="Citação" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />

        <span style={{ width: 1, background: 'var(--divider)', margin: '0 0.2rem', alignSelf: 'stretch' }} />

        <ToolBtn label="▶ YouTube" title="Inserir vídeo do YouTube" onClick={addYoutube} />
        <ToolBtn label="🔗 Link" title="Inserir link" active={editor.isActive('link')} onClick={addLink} />
        {editor.isActive('link') && (
          <ToolBtn label="✕ Link" title="Remover link" onClick={() => editor.chain().focus().unsetLink().run()} />
        )}

        <span style={{ width: 1, background: 'var(--divider)', margin: '0 0.2rem', alignSelf: 'stretch' }} />

        <ToolBtn label="↩ Desfazer" title="Desfazer" onClick={() => editor.chain().focus().undo().run()} />
        <ToolBtn label="↪ Refazer" title="Refazer" onClick={() => editor.chain().focus().redo().run()} />
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .tiptap h2 { font-size: 1.4rem; font-weight: 700; margin: 1.2rem 0 0.5rem; }
        .tiptap h3 { font-size: 1.15rem; font-weight: 600; margin: 1rem 0 0.4rem; }
        .tiptap p  { margin: 0.5rem 0; }
        .tiptap ul, .tiptap ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .tiptap li { margin: 0.25rem 0; }
        .tiptap blockquote {
          border-left: 3px solid var(--coral);
          margin: 0.8rem 0;
          padding: 0.4rem 1rem;
          color: var(--text-mid);
          font-style: italic;
        }
        .tiptap a { color: var(--coral); text-decoration: underline; }
        .tiptap .youtube-video-wrapper,
        .tiptap div[data-youtube-video] { position: relative; padding-bottom: 56.25%; height: 0; margin: 1rem 0; }
        .tiptap .youtube-video-wrapper iframe,
        .tiptap div[data-youtube-video] iframe { position: absolute; top: 0; left: 0; width: 100% !important; height: 100% !important; border-radius: 8px; }
      `}</style>
    </div>
  );
}
