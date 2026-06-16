import { useState } from 'react'

function PandaFloat() {
  return (
    <svg viewBox="-4 -10 108 108" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="52" r="48" fill="#fff" stroke="#1f4ea3" strokeWidth="2.5" />
      <g transform="translate(0,0)">
        <ellipse cx="22" cy="18" rx="13" ry="12" fill="#1a1612" />
        <ellipse cx="78" cy="18" rx="13" ry="12" fill="#1a1612" />
        <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
        <g>
          <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
          <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
        </g>
        <circle cx="30" cy="44" r="3.4" fill="#fff" />
        <circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
        <circle cx="70" cy="44" r="3.4" fill="#fff" />
        <circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
        <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
        <path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
      </g>
    </svg>
  )
}

export default function FloatingPanda() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 22,
          background: 'var(--bg-card)', borderRadius: '14px',
          padding: '14px 16px', maxWidth: 260,
          boxShadow: 'var(--sh-3)', border: '1.5px solid var(--accent)',
          zIndex: 40, fontSize: 13, lineHeight: 1.7,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-deep)', marginBottom: 4 }}>
            パンダ先生
          </div>
          こんにちは！🎋<br />
          何かわからないこと、ある？<br />
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {['仕訳', 'BAPI', '原価計算', 'BOM'].map(t => (
              <span key={t} style={{ fontSize: 11, padding: '3px 8px', background: 'var(--accent-soft)', borderRadius: 999, color: 'var(--accent-deep)', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      )}
      <div className="float-panda" onClick={() => setOpen(o => !o)} title="パンダ先生に質問">
        <PandaFloat />
      </div>
    </>
  )
}
