// ===========================================================
// HtmlEditor — WYSIWYG (TipTap) / HTML / Markdown 三模式编辑器
// 画像アップロード + 吹き出し挿入（パンダ先生・たろうくん）
// ===========================================================
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import { marked } from 'marked'
import TurndownService from 'turndown'
import { API_BASE } from '../../config'
import { DialogExtension } from './extensions/dialog'

const lowlight = createLowlight(common)
const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

// ========== 吹き出しテンプレート ==========
const PANDA_SVG = `<svg width="48" height="48" viewBox="-4 -8 108 108"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 43 70 Q 50 74 57 70" fill="#1a1612" /></svg>`
const TARO_SVG = `<svg width="48" height="48" viewBox="-4 -8 108 108"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><ellipse cx="58" cy="64" rx="5" ry="3" fill="#f4b8c4" opacity="0.6" /><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 46 70 Q 50 74 54 70" fill="#1a1612" /></svg>`

const DIALOG_HTML = {
  panda: `<div class="dialog"><div class="av">${PANDA_SVG}</div><div class="bubble"><span class="who">パンダ先生：</span>ここにセリフを入力</div></div>`,
  taro: `<div class="dialog student"><div class="av">${TARO_SVG}</div><div class="bubble"><span class="who">たろうくん：</span>ここにセリフを入力</div></div>`,
}

type EditorMode = 'visual' | 'html' | 'markdown'

interface HtmlEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

// ========== Color palette for quick pick ==========
const TEXT_COLORS = ['#000000', '#333333', '#666666', '#999999', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#674ea7', '#a64d79']
const BG_COLORS = ['#ffffff', '#f3f3f3', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc', '#dddddd', '#cccccc']

export default function HtmlEditor({ value: initialValue, onChange, placeholder }: HtmlEditorProps) {
  const [mode, setMode] = useState<EditorMode>('visual')
  const [htmlSource, setHtmlSource] = useState(initialValue)
  const [mdSource, setMdSource] = useState('')
  const [colorPicker, setColorPicker] = useState<'text' | 'bg' | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef(initialValue)
  const prevValueRef = useRef(initialValue)

  // ========== TipTap Editor ==========
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Placeholder.configure({ placeholder: placeholder || 'コンテンツを入力...' }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      ImageExtension,
      Subscript,
      Superscript,
      CodeBlockLowlight.configure({ lowlight }),
      DialogExtension,
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      contentRef.current = html
      onChange(html)
    },
  })

  // ========== Handle external value changes ==========
  useEffect(() => {
    if (!editor) return
    if (prevValueRef.current === initialValue) return
    prevValueRef.current = initialValue

    // Only sync when the content actually differs
    if (initialValue !== contentRef.current) {
      contentRef.current = initialValue

      if (mode === 'visual') {
        editor.commands.setContent(initialValue)
      } else if (mode === 'html') {
        setHtmlSource(initialValue)
      } else {
        try { setMdSource(turndownService.turndown(initialValue)) } catch { setMdSource(initialValue) }
      }
    }
  }, [initialValue, editor, mode])

  // ========== Mode switching ==========
  const handleModeChange = useCallback((newMode: EditorMode) => {
    if (newMode === mode || !editor) return

    if (newMode === 'html') {
      // Visual → HTML
      const html = formatHtml(contentRef.current)
      setHtmlSource(html)
      onChange(contentRef.current)
    } else if (newMode === 'markdown') {
      // Visual → Markdown
      try {
        const md = turndownService.turndown(contentRef.current)
        setMdSource(md)
      } catch { setMdSource(contentRef.current) }
      onChange(contentRef.current)
    } else if (newMode === 'visual') {
      // HTML/Markdown → Visual
      const html = mode === 'html'
        ? htmlSource
        : (marked.parse(mdSource, { async: false }) as string)
      editor.commands.setContent(html)
      contentRef.current = html
      onChange(html)
    }

    setMode(newMode)
    setColorPicker(null)

    // Auto-focus textarea when switching to html/md
    if (newMode !== 'visual') {
      setTimeout(() => textAreaRef.current?.focus(), 50)
    }
  }, [mode, editor, htmlSource, mdSource, onChange])

  // ========== Image upload ==========
  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file || !editor) return
      const formData = new FormData()
      formData.append('image', file)
      try {
        const res = await fetch(`${API_BASE}/media/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('sap_panda_token') || ''}` },
          body: formData,
        })
        const json = await res.json()
        if (json.success && json.data?.url) {
          editor.chain().focus().setImage({ src: json.data.url }).run()
        } else {
          alert(json.message || 'アップロードに失敗しました。')
        }
      } catch {
        alert('画像のアップロード中にエラーが発生しました。')
      }
    }
  }, [editor])

  // ========== Dialog insertion ==========
  const insertDialog = useCallback((who: 'panda' | 'taro') => {
    if (!editor) return
    editor.chain().focus().insertContent({
      type: 'dialog',
      attrs: { who, text: '' },
    }).run()
  }, [editor])

  // ========== Link insertion ==========
  const handleLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href as string || ''
    const url = window.prompt('リンクURLを入力してください', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().toggleLink({ href: url, target: '_blank' }).run()
  }, [editor])

  // ========== HTML/MD mode helpers ==========
  const handleHtmlChange = (val: string) => {
    setHtmlSource(val)
    contentRef.current = val
    onChange(val)
  }

  const handleMdChange = (val: string) => {
    setMdSource(val)
    try {
      const html = marked.parse(val, { async: false }) as string
      contentRef.current = html
      onChange(html)
    } catch { /* ignore */ }
  }

  const insertHtmlAtCursor = (html: string) => {
    const ta = textAreaRef.current
    if (!ta) {
      const fallback = htmlSource + '\n' + html + '\n'
      handleHtmlChange(fallback)
      return
    }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const newVal = htmlSource.substring(0, start) + html + htmlSource.substring(end)
    handleHtmlChange(newVal)
    requestAnimationFrame(() => {
      ta.setSelectionRange(start + html.length, start + html.length)
      ta.focus()
    })
  }

  // ========== Color Picker ==========
  const toggleColorPicker = (type: 'text' | 'bg') => {
    setColorPicker(prev => prev === type ? null : type)
  }

  const applyColor = (type: 'text' | 'bg', color: string) => {
    if (!editor) return
    if (type === 'text') {
      editor.chain().focus().setColor(color).run()
    } else {
      editor.chain().focus().toggleHighlight({ color }).run()
    }
    setColorPicker(null)
  }

  // ========== Format HTML ==========
  function formatHtml(html: string): string {
    const tab = '  '
    let result = ''
    let indent = 0
    const pres: string[] = []
    html = html.replace(/<pre[\s>][\s\S]*?<\/pre>/gi, m => { pres.push(m); return `\x00PRE${pres.length - 1}\x00` })
    html = html.replace(/<code[\s>][\s\S]*?<\/code>/gi, m => { pres.push(m); return `\x00PRE${pres.length - 1}\x00` })
    html = html.replace(/>\s*</g, '>\n<')
    const lines = html.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      if (/^<\//.test(trimmed)) indent = Math.max(0, indent - 1)
      result += tab.repeat(indent) + trimmed + '\n'
      if (/^<[^/?!][^>]*>[^<]*$/.test(trimmed) && !/\/>$/.test(trimmed) && !/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(trimmed.replace(/<([a-z]+).*/i, '$1'))) indent++
    }
    result = result.replace(/\x00PRE(\d+)\x00/g, (_, i) => pres[parseInt(i)])
    return result.trim()
  }

  // ========== Toolbar button helpers ==========
  const isActive = (name: string, attrs?: Record<string, any>) => editor?.isActive(name, attrs) ?? false
  const tb = (label: string, action: () => void, active?: boolean) => {
    const isOn = active ?? false
    return (
      <button
        key={label}
        type="button"
        onClick={action}
        title={label}
        style={{
          padding: '4px 8px',
          fontSize: 13,
          fontWeight: isOn ? 700 : 400,
          cursor: 'pointer',
          border: 'none',
          background: isOn ? '#d4e4f7' : 'transparent',
          color: isOn ? '#1a5b9c' : '#444',
          borderRadius: 4,
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
          transition: 'all 0.1s',
        }}
        onMouseEnter={e => { if (!isOn) e.currentTarget.style.background = '#eee' }}
        onMouseLeave={e => { if (!isOn) e.currentTarget.style.background = 'transparent' }}
      >
        {label}
      </button>
    )
  }

  // Cleanup editor on unmount
  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  // ========== Styles ==========
  const tab = (active: boolean) => ({
    padding: '8px 18px',
    fontSize: 12.5,
    fontWeight: active ? 700 : 500,
    cursor: 'pointer' as const,
    border: 'none',
    background: active ? 'var(--bg-card)' : 'transparent',
    color: active ? 'var(--accent-deep)' : 'var(--ink-2)',
    borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
    fontFamily: 'inherit' as const,
    transition: 'all 0.12s',
  })

  const darkBtn: React.CSSProperties = {
    padding: '4px 10px',
    fontSize: 11.5,
    background: '#2a2b3e',
    color: '#a9b1d6',
    border: '1px solid #3a3b4e',
    borderRadius: 4,
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  }

  const styles = {
    bar: { display: 'flex', gap: 0, marginBottom: 0, borderBottom: '1px solid var(--line-2)', background: 'var(--bg-1)' } as React.CSSProperties,
    textarea: { width: '100%', minHeight: 360, padding: 16, fontFamily: "'JetBrains Mono', 'SF Mono', 'Consolas', monospace", fontSize: 13, lineHeight: 1.7, border: 'none', outline: 'none', resize: 'vertical', background: '#1a1b26', color: '#a9b1d6', tabSize: 2 } as React.CSSProperties,
  }

  return (
    <div className="html-editor" style={{ border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
      {/* ---- Mode tabs ---- */}
      <div style={styles.bar}>
        <button style={tab(mode === 'visual')} onClick={() => handleModeChange('visual')} type="button">✏️ ビジュアル</button>
        <button style={tab(mode === 'html')} onClick={() => handleModeChange('html')} type="button">{'</>'} HTML</button>
        <button style={tab(mode === 'markdown')} onClick={() => handleModeChange('markdown')} type="button">📝 Markdown</button>
        <span style={{ marginLeft: 'auto', padding: '8px 14px', fontSize: 11, color: 'var(--ink-3)' }}>
          {mode === 'visual' ? 'TipTap WYSIWYG' : mode === 'html' ? 'HTML' : 'Markdown'}
        </span>
      </div>

      {/* ======== VISUAL MODE ======== */}
      {mode === 'visual' && editor && (
        <div>
          {/* ---- Dialog buttons bar ---- */}
          <div style={{ display: 'flex', gap: 4, padding: '6px 10px', background: '#fcf8ee', borderBottom: '1px solid rgba(60,45,20,0.15)', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#8a7a5a', marginRight: 4 }}>吹き出し：</span>
            <button type="button" onClick={() => insertDialog('panda')} style={{ padding: '4px 12px', fontSize: 12, background: '#fdfaf2', color: '#5a4a2a', border: '1px solid #d4c8a8', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>🐼 パンダ先生</button>
            <button type="button" onClick={() => insertDialog('taro')} style={{ padding: '4px 12px', fontSize: 12, background: '#fdfaf2', color: '#5a4a2a', border: '1px solid #d4c8a8', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>👨‍💻 たろうくん</button>
            <span style={{ flex: 1 }} />

            <span style={{ fontSize: 11, color: '#aaa', marginRight: 8 }}>
              吹き出し内のテキストをクリックして編集
            </span>
          </div>

          {/* ---- Formatting toolbar ---- */}
          <div style={{
            display: 'flex', gap: 2, padding: '6px 8px',
            background: '#f8f8f8', borderBottom: '1px solid #e0e0e0',
            flexWrap: 'wrap', alignItems: 'center',
          }}>
            {/* Headings */}
            {tb('見出し1', () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive('heading', { level: 1 }))}
            {tb('見出し2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive('heading', { level: 2 }))}
            {tb('見出し3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive('heading', { level: 3 }))}
            <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

            {/* Text styles */}
            {tb('B', () => editor.chain().focus().toggleBold().run(), isActive('bold'))}
            {tb('I', () => editor.chain().focus().toggleItalic().run(), isActive('italic'))}
            {tb('U', () => editor.chain().focus().toggleUnderline().run(), isActive('underline'))}
            {tb('S', () => editor.chain().focus().toggleStrike().run(), isActive('strike'))}
            <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

            {/* Sub/Superscript */}
            {tb('x₁', () => editor.chain().focus().toggleSubscript().run(), isActive('subscript'))}
            {tb('x¹', () => editor.chain().focus().toggleSuperscript().run(), isActive('superscript'))}
            <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

            {/* Lists */}
            {tb('•', () => editor.chain().focus().toggleBulletList().run(), isActive('bulletList'))}
            {tb('1.', () => editor.chain().focus().toggleOrderedList().run(), isActive('orderedList'))}
            <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

            {/* Block elements */}
            {tb('❝', () => editor.chain().focus().toggleBlockquote().run(), isActive('blockquote'))}
            {tb('<>', () => editor.chain().focus().toggleCodeBlock().run(), isActive('codeBlock'))}
            <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

            {/* Align */}
            {tb('⬅', () => editor.chain().focus().setTextAlign('left').run(), isActive('textAlign', { textAlign: 'left' }))}
            {tb('≡', () => editor.chain().focus().setTextAlign('center').run(), isActive('textAlign', { textAlign: 'center' }))}
            {tb('➡', () => editor.chain().focus().setTextAlign('right').run(), isActive('textAlign', { textAlign: 'right' }))}
            <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

            {/* Colors */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {tb('A', () => toggleColorPicker('text'), colorPicker === 'text')}
              {colorPicker === 'text' && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, zIndex: 100,
                  background: '#fff', border: '1px solid #ddd', borderRadius: 8,
                  padding: 6, display: 'flex', flexWrap: 'wrap', gap: 2, width: 168,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                }}>
                  {TEXT_COLORS.map(c => (
                    <button key={c} type="button" onClick={() => applyColor('text', c)}
                      style={{ width: 24, height: 24, background: c, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
                      title={c} />
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: 'relative', display: 'inline-block' }}>
              {tb('■', () => toggleColorPicker('bg'), colorPicker === 'bg')}
              {colorPicker === 'bg' && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, zIndex: 100,
                  background: '#fff', border: '1px solid #ddd', borderRadius: 8,
                  padding: 6, display: 'flex', flexWrap: 'wrap', gap: 2, width: 168,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                }}>
                  {BG_COLORS.map(c => (
                    <button key={c} type="button" onClick={() => applyColor('bg', c)}
                      style={{ width: 24, height: 24, background: c, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
                      title={c} />
                  ))}
                </div>
              )}
            </div>
            <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

            {/* Link & Image */}
            {tb('🔗', () => handleLink(), isActive('link'))}
            {tb('🖼', () => handleImageUpload())}
            <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

            {/* Undo/Redo */}
            {tb('↩', () => editor.chain().focus().undo().run())}
            {tb('↪', () => editor.chain().focus().redo().run())}

            {/* Remove formatting */}
            {tb('✕', () => editor.chain().focus().unsetAllMarks().run())}
          </div>

          {/* ---- Editor content ---- */}
          <div style={{
            padding: 0,
            minHeight: 340,
            cursor: 'text',
          }}
            onClick={() => editor.commands.focus()}
          >
            <style>{`
              .tiptap-editor .ProseMirror {
                min-height: 340px;
                padding: 14px 16px;
                outline: none;
                line-height: 1.85;
                font-size: 14px;
                font-family: "Noto Sans JP", system-ui, sans-serif;
              }
              .tiptap-editor .ProseMirror p { margin: 0 0 8px; }
              .tiptap-editor .ProseMirror h1 { font-size: 1.5em; font-weight: 700; margin: 16px 0 8px; }
              .tiptap-editor .ProseMirror h2 { font-size: 1.25em; font-weight: 700; margin: 14px 0 6px; }
              .tiptap-editor .ProseMirror h3 { font-size: 1.1em; font-weight: 600; margin: 12px 0 4px; }
              .tiptap-editor .ProseMirror ul, .tiptap-editor .ProseMirror ol { padding-left: 24px; margin: 4px 0; }
              .tiptap-editor .ProseMirror blockquote {
                border-left: 3px solid #ccc;
                margin: 8px 0;
                padding: 4px 12px;
                color: #666;
                font-style: italic;
              }
              .tiptap-editor .ProseMirror pre {
                background: #1a1b26;
                color: #a9b1d6;
                padding: 12px;
                border-radius: 6px;
                font-family: "JetBrains Mono", monospace;
                font-size: 13px;
                overflow-x: auto;
                margin: 8px 0;
              }
              .tiptap-editor .ProseMirror code {
                font-family: "JetBrains Mono", monospace;
                font-size: 0.9em;
                background: #f0f0f0;
                padding: 1px 4px;
                border-radius: 3px;
              }
              .tiptap-editor .ProseMirror pre code { background: transparent; padding: 0; }
              .tiptap-editor .ProseMirror img { max-width: 100%; height: auto; border-radius: 4px; margin: 8px 0; }
              .tiptap-editor .ProseMirror a { color: #1a73e8; cursor: pointer; }
              .tiptap-editor .ProseMirror a:hover { text-decoration: underline; }
              .tiptap-editor .ProseMirror hr { margin: 16px 0; border: none; border-top: 1px solid #ddd; }
              .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
                color: #adb5bd;
                content: attr(data-placeholder);
                float: left;
                height: 0;
                pointer-events: none;
              }
              /* Dialog node in editor */
              .tiptap-editor .ProseMirror div.dialog:hover .dialog-delete-btn { opacity: 1 !important; }
              /* Lowlight code highlighting */
              .tiptap-editor .ProseMirror .hljs-keyword { color: #bb9af7; }
              .tiptap-editor .ProseMirror .hljs-string { color: #9ece6a; }
              .tiptap-editor .ProseMirror .hljs-number { color: #ff9e64; }
              .tiptap-editor .ProseMirror .hljs-comment { color: #565f89; font-style: italic; }
              .tiptap-editor .ProseMirror .hljs-function { color: #7aa2f7; }
              .tiptap-editor .ProseMirror .hljs-built_in { color: #e0af68; }
              .tiptap-editor .ProseMirror .hljs-attr { color: #73daca; }
            `}</style>
            <div className="tiptap-editor">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      )}

      {/* ======== HTML MODE ======== */}
      {mode === 'html' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#1a1b26', borderBottom: '1px solid #2a2b3e' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <button type="button" onClick={() => insertHtmlAtCursor(DIALOG_HTML.panda)} style={darkBtn}>🐼 パンダ先生</button>
              <button type="button" onClick={() => insertHtmlAtCursor(DIALOG_HTML.taro)} style={darkBtn}>👨‍💻 たろうくん</button>
            </div>
            <button type="button" onClick={() => setHtmlSource(formatHtml(htmlSource))}
              style={{ padding: '4px 12px', fontSize: 11.5, background: '#2a2b3e', color: '#a9b1d6', border: '1px solid #3a3b4e', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit' }}>
              🔄 フォーマット
            </button>
          </div>
          <textarea ref={textAreaRef} style={styles.textarea}
            value={htmlSource}
            onChange={e => handleHtmlChange(e.target.value)}
            placeholder="HTML を直接入力..."
            spellCheck={false}
          />
        </div>
      )}

      {/* ======== MARKDOWN MODE ======== */}
      {mode === 'markdown' && (
        <textarea ref={textAreaRef} style={styles.textarea}
          value={mdSource}
          onChange={e => handleMdChange(e.target.value)}
          placeholder="Markdown で入力（自動的に HTML に変換されます）..."
          spellCheck={false}
        />
      )}
    </div>
  )
}
