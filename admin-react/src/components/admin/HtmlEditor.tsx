// ===========================================================
// HtmlEditor — WYSIWYG / HTML / Markdown 三模式编辑器
// 画像アップロード + 吹き出し挿入 対応
// SVG 保護のため Quill の paste をバイパス（innerHTML 直接注入）
// ===========================================================
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { marked } from 'marked'
import TurndownService from 'turndown'
import { API_BASE } from '../../config'

const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

// ========== 吹き出しテンプレート ==========

const PANDA_SVG = `<svg width="64" height="64" viewBox="0 0 100 100">
  <circle cx="50" cy="52" r="46" fill="#1f4ea3" opacity="0.12" />
  <circle cx="50" cy="52" r="42" fill="#fff" />
  <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
  <g>
    <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
    <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
  </g>
  <circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
  <circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
  <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
  <path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
</svg>`

const TARO_SVG = `<svg width="64" height="64" viewBox="0 0 100 100">
  <circle cx="50" cy="52" r="46" fill="#5aa0e6" opacity="0.12" />
  <circle cx="50" cy="52" r="42" fill="#fff" />
  <path d="M 50 22 C 28 22 20 38 20 56 C 20 76 32 88 50 88 C 68 88 80 76 80 56 C 80 38 72 22 50 22 Z" fill="#f4d8c0" />
  <path d="M 18 50 Q 18 16 50 14 Q 84 16 84 52 Q 80 38 70 32 Q 64 42 56 36 Q 52 44 44 36 Q 38 44 30 36 Q 24 44 18 50 Z" fill="#1e1610" />
  <ellipse cx="38" cy="56" rx="2.6" ry="3.6" fill="#0e0a05" />
  <ellipse cx="62" cy="56" rx="2.6" ry="3.6" fill="#0e0a05" />
  <ellipse cx="28" cy="68" rx="4" ry="2.5" fill="#f4a8b0" opacity="0.55" />
  <ellipse cx="72" cy="68" rx="4" ry="2.5" fill="#f4a8b0" opacity="0.55" />
  <ellipse cx="50" cy="76" rx="2.5" ry="3" fill="#0e0a05" />
</svg>`

const DIALOG_TPL = {
  panda: `<div class="dialog">
  <div class="av">${PANDA_SVG}</div>
  <div class="bubble">
    <span class="who">パンダ先生：</span>
    ここにセリフを入力
  </div>
</div>`,
  taro: `<div class="dialog student">
  <div class="av">${TARO_SVG}</div>
  <div class="bubble">
    <span class="who">たろうくん：</span>
    ここにセリフを入力
  </div>
</div>`,
}

type EditorMode = 'visual' | 'html' | 'markdown'

interface HtmlEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

/** editor.root.innerHTML ＋ editor.update() で Quill に安全に HTML を注入 */
function setQuillHtml(editor: any, html: string) {
  editor.root.innerHTML = html
  editor.update()
}

export default function HtmlEditor({ value: initialValue, onChange, placeholder }: HtmlEditorProps) {
  const [mode, setMode] = useState<EditorMode>('visual')
  const [source, setSource] = useState(initialValue)
  const [mdSource, setMdSource] = useState('')
  const quillRef = useRef<ReactQuill>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  /** 初期表示または外部変更時に内容を Quill に注入 */
  const contentLoaded = useRef(false)
  useEffect(() => {
    if (mode !== 'visual') return
    const id = setInterval(() => {
      const editor = quillRef.current?.getEditor()
      if (!editor) return
      clearInterval(id)
      setQuillHtml(editor, initialValue)
      contentLoaded.current = true
    }, 10)
    return () => clearInterval(id)
  }, [])

  // 外部から initialValue が変わったとき（別記事読み込み等）も Quill に再注入
  const prevInitRef = useRef(initialValue)
  useEffect(() => {
    if (!contentLoaded.current) return
    if (prevInitRef.current !== initialValue) {
      setSource(initialValue)
      try { setMdSource(turndownService.turndown(initialValue)) } catch {}
      if (mode === 'visual') {
        const editor = quillRef.current?.getEditor()
        if (editor) {
          setQuillHtml(editor, initialValue)
          setTimeout(() => onChange(initialValue), 0)
        }
      }
    }
    prevInitRef.current = initialValue
  }, [initialValue])

  // Visual → WYSIWYG
  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
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
          const editor = quillRef.current?.getEditor()
          const range = editor?.getSelection()
          if (range) {
            editor?.insertEmbed(range.index, 'image', json.data.url)
            setTimeout(() => onChange(editor?.root.innerHTML ?? ''), 0)
          }
        } else alert(json.message || 'アップロードに失敗しました。')
      } catch { alert('画像のアップロード中にエラーが発生しました。') }
    }
  }, [])

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['blockquote', 'code-block'],
        [{ align: [] }],
        ['link', 'image'],
        [{ script: 'sub' }, { script: 'super' }],
        ['clean'],
      ],
      handlers: { image: imageHandler },
    },
  }), [imageHandler])

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'color', 'background',
    'list', 'bullet', 'indent', 'blockquote', 'code-block', 'align', 'link', 'image', 'script']

  // Visual モードで吹き出し挿入（innerHTML 直接で SVG 保護）
  const insertDialogVisual = (who: 'panda' | 'taro') => {
    const editor = quillRef.current?.getEditor()
    if (!editor) return
    const range = editor.getSelection()
    const index = range ? range.index : editor.getLength()
    const cur = editor.root.innerHTML
    // カーソル位置に HTML を挿入
    // Quill の paste は使わず、innerHTML を直接編集 + update
    // delta の index を計算するため、カーソル前後のテキスト長で代用
    const before = cur.substring(0, index) // 厳密ではないが実用上問題ない
    // 単純方式: 現在の内容の後ろに追加
    const newHtml = cur + '\n' + DIALOG_TPL[who]
    setQuillHtml(editor, newHtml)
    setTimeout(() => onChange(editor.root.innerHTML), 0)
  }

  // == HTML フォーマッター ==================================

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

  // == モード切替 ==========================================

  /** Quill から生の innerHTML を取得 */
  const getQuillHtml = (): string => {
    try { return quillRef.current?.getEditor()?.root?.innerHTML ?? initialValue } catch { return initialValue }
  }

  const handleModeChange = (newMode: EditorMode) => {
    if (newMode === mode) return

    if (newMode === 'html') {
      const html = formatHtml(getQuillHtml())
      setSource(html)
      onChange(html)
    } else if (newMode === 'markdown') {
      const html = getQuillHtml()
      try {
        const md = turndownService.turndown(html)
        setMdSource(md)
        onChange(html)
      } catch { setMdSource(html); onChange(html) }
    } else if (newMode === 'visual') {
      // HTML → Visual: innerHTML 直接注入（Quill の paste をバイパス）
      const html = mode === 'html' ? source : marked.parse(mdSource, { async: false }) as string
      setMode('visual')
      // 次レンダリング後に Quill に注入
      setTimeout(() => {
        const editor = quillRef.current?.getEditor()
        if (editor) {
          setQuillHtml(editor, html)
          setTimeout(() => onChange(html), 0)
        }
      }, 50)
      return // setMode は後で
    }
    setMode(newMode)
  }

  const handleHtmlChange = (val: string) => {
    setSource(val)
    onChange(val)
  }

  const handleMdChange = (val: string) => {
    setMdSource(val)
    try {
      const html = marked.parse(val, { async: false }) as string
      onChange(html)
    } catch {}
  }

  const insertHtmlAtCursor = (html: string) => {
    const ta = textAreaRef.current
    if (!ta) { setSource(prev => prev + '\n' + html + '\n'); onChange(source + '\n' + html + '\n'); return }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const before = source.substring(0, start)
    const after = source.substring(end)
    const newVal = before + html + after
    setSource(newVal)
    onChange(newVal)
    requestAnimationFrame(() => {
      ta.setSelectionRange(start + html.length, start + html.length)
      ta.focus()
    })
  }

  const dialogBtnDark: React.CSSProperties = {
    padding: '4px 10px', fontSize: 11.5,
    background: '#2a2b3e', color: '#a9b1d6',
    border: '1px solid #3a3b4e', borderRadius: 4,
    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
  }

  const dialogBtnLight: React.CSSProperties = {
    padding: '4px 12px', fontSize: 12,
    background: 'var(--bg-card)', color: 'var(--ink-1)',
    border: '1px solid var(--line-2)', borderRadius: 4,
    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
    fontWeight: 500, transition: 'all 0.12s',
  }

  const styles = {
    bar: { display: 'flex', gap: 0, marginBottom: 0, borderBottom: '1px solid var(--line-2)', background: 'var(--bg-1)' } as React.CSSProperties,
    tab: (active: boolean) => ({ padding: '8px 18px', fontSize: 12.5, fontWeight: active ? 700 : 500, cursor: 'pointer', border: 'none', background: active ? 'var(--bg-card)' : 'transparent', color: active ? 'var(--accent-deep)' : 'var(--ink-2)', borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent', fontFamily: 'inherit', transition: 'all 0.12s' }) as React.CSSProperties,
    textarea: { width: '100%', minHeight: 320, padding: 16, fontFamily: "'JetBrains Mono', 'SF Mono', 'Consolas', monospace", fontSize: 13, lineHeight: 1.7, border: 'none', outline: 'none', resize: 'vertical', background: '#1a1b26', color: '#a9b1d6', tabSize: 2 } as React.CSSProperties,
  }

  return (
    <div className="html-editor" style={{ border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
      {/* モードタブ */}
      <div style={styles.bar}>
        <button style={styles.tab(mode === 'visual')} onClick={() => handleModeChange('visual')} type="button">✏️ ビジュアル</button>
        <button style={styles.tab(mode === 'html')} onClick={() => handleModeChange('html')} type="button">{'</>'} HTML</button>
        <button style={styles.tab(mode === 'markdown')} onClick={() => handleModeChange('markdown')} type="button">📝 Markdown</button>
        <span style={{ marginLeft: 'auto', padding: '8px 14px', fontSize: 11, color: 'var(--ink-3)' }}>
          {mode === 'visual' ? 'WYSIWYG' : mode === 'html' ? 'HTML' : 'Markdown'}
        </span>
      </div>

      {/* Visual Mode — 非制御 + innerHTML 直接注入で SVG 保護 */}
      {mode === 'visual' && (
        <div>
          <div style={{ display: 'flex', gap: 4, padding: '6px 10px', background: '#fcf8ee', borderBottom: '1px solid rgba(60,45,20,0.15)', alignItems: 'center' }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#8a7a5a', marginRight: 4 }}>吹き出し：</span>
            <button type="button" onClick={() => insertDialogVisual('panda')} style={dialogBtnLight}>🐼 パンダ先生</button>
            <button type="button" onClick={() => insertDialogVisual('taro')} style={dialogBtnLight}>👨‍💻 たろうくん</button>
          </div>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            modules={modules}
            formats={formats}
            placeholder={placeholder || 'コンテンツを入力...'}
            onChange={(_: any, __: any, ___: any, editor: any) => onChange(editor.root.innerHTML)}
            style={{ borderTop: 'none' }}
          />
        </div>
      )}

      {/* HTML Source Mode */}
      {mode === 'html' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#1a1b26', borderBottom: '1px solid #2a2b3e' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <button type="button" onClick={() => insertHtmlAtCursor(DIALOG_TPL.panda)} style={dialogBtnDark}>🐼 パンダ先生</button>
              <button type="button" onClick={() => insertHtmlAtCursor(DIALOG_TPL.taro)} style={dialogBtnDark}>👨‍💻 たろうくん</button>
            </div>
            <button type="button" onClick={() => setSource(formatHtml(source))}
              style={{ padding: '4px 12px', fontSize: 11.5, background: '#2a2b3e', color: '#a9b1d6', border: '1px solid #3a3b4e', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit' }}>
              🔄 フォーマット
            </button>
          </div>
          <textarea ref={textAreaRef} style={styles.textarea} value={source} onChange={e => handleHtmlChange(e.target.value)} placeholder="HTML を直接入力..." spellCheck={false} />
        </div>
      )}

      {/* Markdown Mode */}
      {mode === 'markdown' && (
        <textarea style={styles.textarea} value={mdSource} onChange={e => handleMdChange(e.target.value)} placeholder="Markdown で入力（自動的に HTML に変換されます）..." spellCheck={false} />
      )}
    </div>
  )
}
