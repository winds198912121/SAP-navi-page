// ===========================================================
// Dialog Extension — パンダ先生・たろうくん吹き出し
// TipTap カスタムノード + React NodeView
// ===========================================================
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewProps } from '@tiptap/react'
import React from 'react'

// ---- SVG ----
// Encode as base64 data URIs to render via <img> tags,
// avoiding inline-SVG CSS conflicts (global svg{max-width:100%;height:auto})
const _b64 = (svg: string) => {
  // Remove newlines, collapse whitespace
  const min = svg.replace(/>\s+</g, '><').trim()
  return `data:image/svg+xml;base64,${btoa(min)}`
}

const _PANDA = `<svg width="48" height="48" viewBox="-4 -8 108 108" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 43 70 Q 50 74 57 70" fill="#1a1612" /></svg>`
const _TARO = `<svg width="48" height="48" viewBox="-4 -8 108 108" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><ellipse cx="58" cy="64" rx="5" ry="3" fill="#f4b8c4" opacity="0.6" /><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 46 70 Q 50 74 54 70" fill="#1a1612" /></svg>`

const PANDA_IMG = _b64(_PANDA)
const TARO_IMG = _b64(_TARO)

// ---- NodeView Component ----
const DialogNodeView: React.FC<NodeViewProps> = ({ node, updateAttributes, deleteNode, editor }) => {
  const who = node.attrs.who as string
  const text = node.attrs.text as string
  const isStudent = who === 'taro'
  const name = isStudent ? 'たろうくん' : 'パンダ先生'

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || ''
    updateAttributes({ text: newText })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter exits editing
    if (e.key === 'Enter') {
      e.preventDefault()
      ;(e.currentTarget as HTMLDivElement).blur()
    }
  }

  return (
    <div
      className={`dialog ${isStudent ? 'student' : ''}`}
      style={{
        margin: '14px 0',
        padding: '14px 16px',
        background: '#f8f6ef',
        borderRadius: 10,
        border: '1px solid #e0d8c8',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        position: 'relative',
        transition: 'box-shadow 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 2px #b8d4e8' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Avatar - use <img> with data URI to avoid inline-SVG CSS conflicts */}
      <img
        src={isStudent ? TARO_IMG : PANDA_IMG}
        alt={name}
        style={{ width: 48, height: 48, flexShrink: 0, display: 'block' }}
      />

      {/* Bubble */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ color: '#8a7a5a', fontSize: 12.5, display: 'block', marginBottom: 2 }}>
          {name}
        </strong>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            outline: 'none',
            minHeight: 24,
            fontSize: 14,
            lineHeight: 1.6,
            color: '#333',
            cursor: 'text',
            borderRadius: 4,
            padding: '2px 4px',
            transition: 'background 0.12s',
          }}
        >
          {text || 'セリフを入力'}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); deleteNode() }}
        style={{
          position: 'absolute',
          top: 4,
          right: 6,
          border: 'none',
          background: 'rgba(0,0,0,0.05)',
          cursor: 'pointer',
          color: '#999',
          fontSize: 16,
          width: 24,
          height: 24,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.15s',
        }}
        className="dialog-delete-btn"
        title="削除"
      >
        ×
      </button>
    </div>
  )
}

// ---- Node Extension ----
export const DialogExtension = Node.create({
  name: 'dialog',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      who: {
        default: 'panda',
        parseHTML: (el) => (el as HTMLElement).classList.contains('student') ? 'taro' : 'panda',
      },
      text: {
        default: '',
        parseHTML: (el) => {
          const bubble = (el as HTMLElement).querySelector('.bubble')
          if (!bubble) return ''
          return bubble.textContent?.replace(/^[^：]*：\s*/, '').trim() || ''
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div.dialog' }]
  },

  renderHTML({ node }) {
    const who = node.attrs.who || 'panda'
    const text = node.attrs.text || ''
    const isStudent = who === 'taro'
    const name = isStudent ? 'たろうくん' : 'パンダ先生'
    const src = isStudent ? TARO_IMG : PANDA_IMG

    const div = document.createElement('div')
    div.className = `dialog${isStudent ? ' student' : ''}`
    div.innerHTML = `<div class="av"><img src="${src}" alt="${name}" width="48" height="48" /></div><div class="bubble"><span class="who">${name}：</span>${text}</div>`
    return div
  },

  addNodeView() {
    return ReactNodeViewRenderer(DialogNodeView)
  },
})
