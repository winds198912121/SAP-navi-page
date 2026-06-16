// ===========================================================
// Hero Scene — 教室场景组件
// 参考: sap/app/panda.jsx, sap/app/home.jsx
// 含: パンダ先生(PandaSensei) + たろうくん(Student) + 黒板 + 吹き出し
// ===========================================================

/* ---- Panda Head (mortarboard + round glasses) ---- */

function PandaHeadV2({ mood = 'smile', wiggleEars = true, lookDir = 'fwd', noCap = false, size = 100 }: {
  mood?: string; wiggleEars?: boolean; lookDir?: string; noCap?: boolean; size?: number
}) {
  const offsets: Record<string, [number, number]> = { fwd: [0, 0], up: [0, -1], down: [0, 1.4], left: [-1.5, 0], right: [1.5, 0] }
  const [dx, dy] = offsets[lookDir] || [0, 0]
  const s = size / 100
  return (
    <g transform={`scale(${s})`}>
      {/* Black ears */}
      <g className={wiggleEars ? 'ear-wiggle' : ''} style={{ transformOrigin: '24px 22px' }}>
        <ellipse cx="22" cy="18" rx="13" ry="12" fill="#1a1612" />
        <ellipse cx="22" cy="20" rx="6" ry="5" fill="#3a2e22" />
      </g>
      <g className={wiggleEars ? 'ear-wiggle' : ''} style={{ transformOrigin: '76px 22px', animationDelay: '0.3s' }}>
        <ellipse cx="78" cy="18" rx="13" ry="12" fill="#1a1612" />
        <ellipse cx="78" cy="20" rx="6" ry="5" fill="#3a2e22" />
      </g>
      {/* Face */}
      <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
      {/* Eye patches */}
      <g>
        <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
        <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
      </g>
      {/* Glasses */}
      <g>
        <circle cx="30" cy="44" r="11.5" fill="rgba(255,255,255,0.06)" stroke="#0e0a05" strokeWidth="2" />
        <circle cx="70" cy="44" r="11.5" fill="rgba(255,255,255,0.06)" stroke="#0e0a05" strokeWidth="2" />
        <path d="M 41 44 L 59 44" stroke="#0e0a05" strokeWidth="2" />
        <path d="M 22 38 Q 27 35 33 38" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 62 38 Q 67 35 73 38" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Eyes */}
      <g className="eye-blink" style={{ transformOrigin: '30px 44px' }}>
        <circle cx="30" cy="44" r="3.4" fill="#fff" />
        <circle cx={30 + dx} cy={44 + dy} r="2.4" fill="#0e0a05" />
        <circle cx={30 + dx - 0.6} cy={44 + dy - 0.8} r="0.9" fill="#fff" />
      </g>
      <g className="eye-blink" style={{ transformOrigin: '70px 44px', animationDelay: '0.1s' }}>
        <circle cx="70" cy="44" r="3.4" fill="#fff" />
        <circle cx={70 + dx} cy={44 + dy} r="2.4" fill="#0e0a05" />
        <circle cx={70 + dx - 0.6} cy={44 + dy - 0.8} r="0.9" fill="#fff" />
      </g>
      {/* Cheek blush */}
      <ellipse cx="18" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.7" />
      <ellipse cx="82" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.7" />
      {/* Nose */}
      <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
      {/* Mouth (happy) */}
      <path d="M 50 64 L 50 67" stroke="#1a1612" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
      <path d="M 44 70 Q 50 73 56 70" fill="#ff9eb5" />
      {/* Mortarboard cap */}
      {!noCap && (
        <g>
          <ellipse cx="50" cy="14" rx="32" ry="6" fill="#163a78" />
          <path d="M 14 10 L 50 -4 L 86 10 L 50 24 Z" fill="#1f4ea3" stroke="#163a78" strokeWidth="1.2" />
          <circle cx="50" cy="10" r="2.5" fill="#e8c244" />
          <path d="M 50 10 Q 70 14 76 24 L 76 32" fill="none" stroke="#e8c244" strokeWidth="2" />
          <g transform="translate(76 32)">
            <ellipse cx="0" cy="0" rx="3.5" ry="2.5" fill="#e8c244" />
            <line x1="-2" y1="2" x2="-2" y2="10" stroke="#e8c244" strokeWidth="1" />
            <line x1="0" y1="2" x2="0" y2="11" stroke="#e8c244" strokeWidth="1" />
            <line x1="2" y1="2" x2="2" y2="10" stroke="#e8c244" strokeWidth="1" />
          </g>
        </g>
      )}
    </g>
  )
}

/* ---- Panda Sensei full body (pointer pose) ---- */
function PandaSensei() {
  return (
    <svg viewBox="0 0 360 460" aria-label="SAPパンダ先生">
      <defs>
        <radialGradient id="shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,0,0,0.22)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="180" cy="438" rx="110" ry="10" fill="url(#shadow)" />
      {/* ARMS BEHIND body (drawn first so body sits on top) */}
      {/* Left arm with book */}
      <g>
        <path d="M 78 252 Q 50 280 46 340 L 80 348 Q 90 296 110 268 Z" fill="#2e63bd" stroke="#163a78" strokeWidth="2" />
        <ellipse cx="60" cy="346" rx="16" ry="14" fill="#1a1612" />
        <g transform="translate(20 322) rotate(-10)">
          <rect width="58" height="42" rx="3" fill="#fff" stroke="#9a8252" strokeWidth="1.8" />
          <rect width="58" height="9" fill="#1f4ea3" />
          <text x="29" y="7" fontSize="6" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Inter">SAP BOOK</text>
          <rect x="5" y="16" width="48" height="2.5" fill="#cbb98a" />
          <rect x="5" y="22" width="38" height="2" fill="#dac9a0" />
          <rect x="5" y="28" width="44" height="2" fill="#dac9a0" />
          <rect x="5" y="34" width="32" height="2" fill="#dac9a0" />
        </g>
      </g>
      {/* Right arm (pointing) */}
      <g>
        <path d="M 242 252 Q 274 240 286 200 L 264 184 Q 246 220 230 244 Z" fill="#2e63bd" stroke="#163a78" strokeWidth="2" />
        <ellipse cx="282" cy="196" rx="14" ry="13" fill="#1a1612" />
        <g transform="translate(286 192) rotate(-32)" className="hand-wave" style={{ transformOrigin: '0px 0px' }}>
          <rect x="0" y="-3" width="100" height="6" rx="2.5" fill="#a8763e" />
          <rect x="0" y="-3" width="100" height="2.5" fill="#c69258" />
          <circle cx="98" cy="0" r="6" fill="#d97548" />
        </g>
      </g>
      {/* Body (on top of arms) */}
      <path d="M 100 240 Q 80 240 70 260 L 60 360 Q 60 400 90 408 L 230 408 Q 260 400 260 360 L 250 260 Q 240 240 220 240 Z" fill="#1f4ea3" stroke="#163a78" strokeWidth="2" />
      <path d="M 160 240 L 160 408" stroke="#163a78" strokeOpacity="0.3" strokeWidth="0.8" />
      <path d="M 110 330 L 210 330 L 220 380 L 100 380 Z" fill="#163a78" opacity="0.35" />
      <text x="160" y="320" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="44" fill="#fff" letterSpacing="2">SAP</text>
      <path d="M 90 250 Q 100 232 130 232 L 190 232 Q 220 232 230 250 L 220 264 Q 160 256 100 264 Z" fill="#163a78" />
      {/* Hood drawstrings */}
      <path d="M 140 250 L 138 274" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M 180 250 L 182 274" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="138" cy="276" r="2.6" fill="#fff" />
      <circle cx="182" cy="276" r="2.6" fill="#fff" />
      {/* Head — drawn last so it sits on top. size=140, center=50 => 140*0.5=70 offset. Body center x=160 -> translate x = 160-70 = 90 */}
      <g transform="translate(90 128)">
        <PandaHeadV2 mood="happy" wiggleEars={true} size={140} />
      </g>
    </svg>
  )
}

/* ---- Student Head ---- */
function StudentHead({ mood = 'smile', lookDir = 'fwd' }: { mood?: string; lookDir?: string }) {
  const offsets: Record<string, [number, number]> = { fwd: [0, 0], up: [0, -1], down: [0, 1.4], left: [-1.5, 0], right: [1.5, 0] }
  const [dx, dy] = offsets[lookDir] || [0, 0]
  return (
    <g>
      <ellipse cx="86" cy="54" rx="4" ry="6" fill="#f4d8c0" stroke="#c89884" strokeWidth="0.8" />
      <path d="M 50 22 C 28 22 20 38 20 56 C 20 76 32 88 50 88 C 68 88 80 76 80 56 C 80 38 72 22 50 22 Z" fill="#f4d8c0" />
      <path d="M 64 36 Q 78 50 74 70 Q 70 84 56 87" fill="none" stroke="#e8b89c" strokeWidth="0.8" opacity="0.5" />
      {/* Hair */}
      <path d="M 18 50 Q 18 16 50 14 Q 84 16 84 52 Q 80 38 70 32 Q 64 42 56 36 Q 52 44 44 36 Q 38 44 30 36 Q 24 44 18 50 Z" fill="#1e1610" />
      <path d="M 30 30 Q 36 22 42 32 Q 48 24 54 32 Q 60 22 66 32" fill="none" stroke="#1e1610" strokeWidth="3" strokeLinecap="round" />
      {/* Eyes */}
      <g className="eye-blink" style={{ transformOrigin: '38px 56px' }}>
        <ellipse cx="38" cy="56" rx="2.6" ry="3.6" fill="#0e0a05" />
        <circle cx={37 + dx * 0.6} cy={55 + dy * 0.6} r="0.9" fill="#fff" />
      </g>
      <g className="eye-blink" style={{ transformOrigin: '62px 56px', animationDelay: '0.1s' }}>
        <ellipse cx="62" cy="56" rx="2.6" ry="3.6" fill="#0e0a05" />
        <circle cx={61 + dx * 0.6} cy={55 + dy * 0.6} r="0.9" fill="#fff" />
      </g>
      {/* Eyebrows */}
      <path d="M 32 48 Q 38 46 44 48" fill="none" stroke="#1e1610" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 56 48 Q 62 46 68 48" fill="none" stroke="#1e1610" strokeWidth="2.2" strokeLinecap="round" />
      {/* Cheeks + Nose */}
      <ellipse cx="28" cy="68" rx="4" ry="2.5" fill="#f4a8b0" opacity="0.55" />
      <ellipse cx="72" cy="68" rx="4" ry="2.5" fill="#f4a8b0" opacity="0.55" />
      <path d="M 50 60 Q 49 64 50 66" fill="none" stroke="#c89884" strokeWidth="1.4" strokeLinecap="round" />
      {/* Mouth (happy) */}
      <path d="M 42 72 Q 50 82 58 72" fill="#0e0a05" />
      <path d="M 44 74 Q 50 78 56 74" fill="#ff9eb5" />
    </g>
  )
}

/* ---- Student Taro full body (cheer pose) ---- */
function StudentTaro() {
  return (
    <svg viewBox="0 0 320 460" aria-label="たろうくん">
      <ellipse cx="160" cy="438" rx="90" ry="8" fill="#000" opacity="0.18" />
      {/* Arms BEHIND body */}
      <g>
        <path d="M 232 254 Q 264 220 254 168 L 232 172 Q 224 220 214 244 Z" fill="#5aa0e6" stroke="#3a78b8" strokeWidth="2" />
        <circle cx="244" cy="170" r="14" fill="#f4d8c0" stroke="#c89884" strokeWidth="1" />
        <path d="M 238 164 Q 244 160 250 164" fill="none" stroke="#c89884" strokeWidth="1" />
      </g>
      <g>
        <path d="M 88 254 Q 64 296 78 348 L 110 350 Q 110 304 122 270 Z" fill="#5aa0e6" stroke="#3a78b8" strokeWidth="2" />
        <circle cx="88" cy="348" r="13" fill="#f4d8c0" stroke="#c89884" strokeWidth="1" />
      </g>
      {/* Hoodie body */}
      <path d="M 100 240 Q 84 244 76 260 L 66 360 Q 66 400 96 408 L 224 408 Q 254 400 254 360 L 244 260 Q 236 244 220 240 Z" fill="#5aa0e6" stroke="#3a78b8" strokeWidth="2" />
      <path d="M 90 252 Q 100 232 130 232 L 190 232 Q 220 232 230 252 L 222 268 Q 160 256 98 268 Z" fill="#3a78b8" />
      <path d="M 112 332 L 208 332 L 218 380 L 102 380 Z" fill="#3a78b8" opacity="0.4" />
      {/* Drawstrings */}
      <path d="M 142 252 L 140 276" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M 178 252 L 180 276" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="140" cy="278" r="2.4" fill="#fff" />
      <circle cx="180" cy="278" r="2.4" fill="#fff" />
      {/* Neck */}
      <rect x="142" y="228" width="36" height="20" fill="#f4d8c0" stroke="#c89884" strokeWidth="0.8" />
      {/* Head */}
      <g transform="translate(110 150)">
        <StudentHead mood="happy" />
      </g>
    </svg>
  )
}

/* ---- ChalkBoard (blackboard with T-account diagram) ---- */
function ChalkBoard() {
  return (
    <svg viewBox="0 0 200 160" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
      <text x="20" y="26" fontSize="13" fill="rgba(255,240,200,0.95)" fontFamily="Caveat, cursive" fontWeight="700">
        📐 今日のテーマ
      </text>
      <text x="20" y="44" fontSize="11" fill="rgba(255,240,200,0.85)" fontFamily="Caveat, cursive">
        仕訳のしくみ
      </text>
      {/* T-account */}
      <line x1="100" y1="54" x2="100" y2="140" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <line x1="20" y1="72" x2="180" y2="72" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <text x="50" y="68" fontSize="10" fill="rgba(255,224,132,0.95)" fontFamily="Caveat, cursive" textAnchor="middle">借方</text>
      <text x="150" y="68" fontSize="10" fill="rgba(255,179,196,0.95)" fontFamily="Caveat, cursive" textAnchor="middle">貸方</text>
      <text x="36" y="94" fontSize="9" fill="rgba(255,255,255,0.85)" fontFamily="Caveat, cursive" textAnchor="middle">現金 100</text>
      <text x="164" y="94" fontSize="9" fill="rgba(184,232,176,0.95)" fontFamily="Caveat, cursive" textAnchor="middle">売上 100</text>
      <text x="36" y="118" fontSize="9" fill="rgba(255,255,255,0.75)" fontFamily="Caveat, cursive" textAnchor="middle">受取手形 50</text>
      <text x="164" y="118" fontSize="9" fill="rgba(184,232,176,0.85)" fontFamily="Caveat, cursive" textAnchor="middle">受取利息 50</text>
      <path d="M 56 126 Q 86 138 116 126" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeDasharray="3,3" />
    </svg>
  )
}

/* ---- Scene callout cards ---- */
function FloatingCallouts() {
  return (
    <div className="hero-callouts">
      <div className="callout c1">
        <div className="em" style={{ background: '#2f6d44' }}>FI</div>
        <div>
          財務会計
          <small>新着 3 本</small>
        </div>
      </div>
      <div className="callout c2">
        <div className="em" style={{ background: '#1f6f6f' }}>{'<>'}</div>
        <div>
          ABAP入門
          <small>初心者向け</small>
        </div>
      </div>
      <div className="callout c3">
        <div className="em" style={{ background: '#b62a4a' }}>SD</div>
        <div>
          受注プロセス
          <small>人気 ★</small>
        </div>
      </div>
    </div>
  )
}

/* ---- HeroScene — 主组件 ---- */
export default function HeroScene() {
  return (
    <div className="hero-scene">
      {/* 地面阴影 */}
      <div className="floor"></div>

      {/* 中央：黒板 */}
      <div className="blackboard">
        <ChalkBoard />
      </div>

      {/* 左側：パンダ先生 (指差し) */}
      <div className="hero-panda-wrap">
        <PandaSensei />
      </div>

      {/* 右側：たろうくん (応援) */}
      <div className="hero-student-wrap">
        <StudentTaro />
      </div>

      {/* 浮動ラベル */}
      <FloatingCallouts />
    </div>
  )
}
