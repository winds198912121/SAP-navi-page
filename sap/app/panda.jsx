// ===========================================================
// Panda — SAPパンダ先生 v2: mortarboard + SAP hoodie + glasses
// Plus たろうくん (Student) and scene variations
// ===========================================================

const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;

// ====== Theme palette for characters (kept independent of CSS theme) ======
const SAP_NAVY = "#1f4ea3";
const SAP_NAVY_DEEP = "#163a78";
const SAP_NAVY_LIGHT = "#2e63bd";
const PANDA_BLACK = "#1a1612";
const FUR_WHITE = "#fdfaf2";
const SHIRT_BLUE = "#5aa0e6";  // student hoodie
const SHIRT_BLUE_DEEP = "#3a78b8";
const SKIN = "#f4d8c0";
const HAIR = "#1e1610";

// ========== Eye blink (CSS class) ==========
function Blink({ children, delay = 0, cx = 0, cy = 0 }) {
  return (
    <g className="eye-blink" style={{ transformOrigin: `${cx}px ${cy}px`, animationDelay: `${delay}s` }}>
      {children}
    </g>
  );
}

// ========== Panda Head (new style — mortarboard, round glasses) ==========
function PandaHeadV2({ x = 0, y = 0, size = 100, mood = 'smile', wiggleEars = true, lookDir = 'fwd', noCap = false }) {
  // size = head width in svg units (head occupies 100 wide)
  const s = size / 100;
  // lookDir offset for pupils
  const offsets = { fwd: [0,0], up: [0,-1], down: [0,1.4], left: [-1.5,0], right: [1.5,0] };
  const [dx, dy] = offsets[lookDir] || [0,0];

  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Black ears */}
      <g className={wiggleEars ? "ear-wiggle" : ""} style={{ transformOrigin: '24px 22px' }}>
        <ellipse cx="22" cy="18" rx="13" ry="12" fill={PANDA_BLACK} />
        <ellipse cx="22" cy="20" rx="6" ry="5" fill="#3a2e22" />
      </g>
      <g className={wiggleEars ? "ear-wiggle" : ""} style={{ transformOrigin: '76px 22px', animationDelay: '0.3s' }}>
        <ellipse cx="78" cy="18" rx="13" ry="12" fill={PANDA_BLACK} />
        <ellipse cx="78" cy="20" rx="6" ry="5" fill="#3a2e22" />
      </g>

      {/* Face — slightly tapered */}
      <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z"
        fill={FUR_WHITE} />
      {/* face contour shading */}
      <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z"
        fill="none" stroke="#e3dac4" strokeWidth="1" />

      {/* Eye patches (sunglasses-feel) — large dark almond shapes */}
      <g>
        <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill={PANDA_BLACK} />
        <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill={PANDA_BLACK} />
      </g>

      {/* Round glasses on top of patches */}
      <g>
        <circle cx="30" cy="44" r="11.5" fill="rgba(255,255,255,0.06)" stroke="#0e0a05" strokeWidth="2" />
        <circle cx="70" cy="44" r="11.5" fill="rgba(255,255,255,0.06)" stroke="#0e0a05" strokeWidth="2" />
        <path d="M 41 44 L 59 44" stroke="#0e0a05" strokeWidth="2" />
        {/* shine */}
        <path d="M 22 38 Q 27 35 33 38" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 62 38 Q 67 35 73 38" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Eyes inside */}
      {mood === 'closed' || mood === 'sleep' ? (
        <>
          <path d="M 24 44 Q 30 41 36 44" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 64 44 Q 70 41 76 44" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Blink cx={30} cy={44} delay={0}>
            <circle cx="30" cy="44" r="3.4" fill="#fff" />
            <circle cx={30 + dx} cy={44 + dy} r="2.4" fill="#0e0a05" />
            <circle cx={30 + dx - 0.6} cy={44 + dy - 0.8} r="0.9" fill="#fff" />
          </Blink>
          <Blink cx={70} cy={44} delay={0.1}>
            <circle cx="70" cy="44" r="3.4" fill="#fff" />
            <circle cx={70 + dx} cy={44 + dy} r="2.4" fill="#0e0a05" />
            <circle cx={70 + dx - 0.6} cy={44 + dy - 0.8} r="0.9" fill="#fff" />
          </Blink>
        </>
      )}

      {/* Cheek blush */}
      <ellipse cx="18" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.7" />
      <ellipse cx="82" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.7" />

      {/* Nose */}
      <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill={PANDA_BLACK} />
      <ellipse cx="49.2" cy="61.2" rx="1.1" ry="0.7" fill="#fff" opacity="0.6" />

      {/* Mouth */}
      {mood === 'smile' && (
        <>
          <path d="M 50 64 L 50 67" stroke={PANDA_BLACK} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 43 70 Q 50 74 57 70" fill="none" stroke={PANDA_BLACK} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
      {mood === 'happy' && (
        <>
          <path d="M 50 64 L 50 67" stroke={PANDA_BLACK} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 42 68 Q 50 78 58 68" fill={PANDA_BLACK} />
          <path d="M 44 70 Q 50 73 56 70" fill="#ff9eb5" />
        </>
      )}
      {mood === 'laugh' && (
        <>
          <path d="M 50 64 L 50 67" stroke={PANDA_BLACK} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 40 67 Q 50 82 60 67 Q 50 70 40 67 Z" fill={PANDA_BLACK} />
          <path d="M 42 72 Q 50 76 58 72" fill="#ff9eb5" />
        </>
      )}
      {mood === 'o' && (
        <ellipse cx="50" cy="71" rx="3" ry="3.5" fill={PANDA_BLACK} />
      )}
      {mood === 'think' && (
        <>
          <path d="M 50 64 L 50 67" stroke={PANDA_BLACK} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 44 71 Q 50 70 56 71" fill="none" stroke={PANDA_BLACK} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
      {mood === 'flat' && (
        <>
          <path d="M 50 64 L 50 67" stroke={PANDA_BLACK} strokeWidth="1.4" strokeLinecap="round" />
          <line x1="45" y1="71" x2="55" y2="71" stroke={PANDA_BLACK} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}

      {/* Mortarboard cap */}
      {!noCap && (
        <g>
          {/* band */}
          <ellipse cx="50" cy="14" rx="32" ry="6" fill={SAP_NAVY_DEEP} />
          {/* top square */}
          <path d="M 14 10 L 50 -4 L 86 10 L 50 24 Z" fill={SAP_NAVY} stroke={SAP_NAVY_DEEP} strokeWidth="1.2" />
          <path d="M 14 10 L 50 -4 L 86 10 L 50 24 Z" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
          {/* button */}
          <circle cx="50" cy="10" r="2.5" fill="#e8c244" />
          {/* tassel */}
          <path d="M 50 10 Q 70 14 76 24 L 76 32" fill="none" stroke="#e8c244" strokeWidth="2" />
          <g transform="translate(76 32)">
            <ellipse cx="0" cy="0" rx="3.5" ry="2.5" fill="#e8c244" />
            <line x1="-2" y1="2" x2="-2" y2="10" stroke="#e8c244" strokeWidth="1" />
            <line x1="0" y1="2" x2="0" y2="11" stroke="#e8c244" strokeWidth="1" />
            <line x1="2" y1="2" x2="2" y2="10" stroke="#e8c244" strokeWidth="1" />
            <line x1="-1" y1="2" x2="-1" y2="9" stroke="#d4a82a" strokeWidth="0.6" />
            <line x1="1" y1="2" x2="1" y2="9" stroke="#d4a82a" strokeWidth="0.6" />
          </g>
        </g>
      )}
    </g>
  );
}

// ========== Panda body in SAP hoodie ==========
function PandaBody({ children, withBook = false, pose = 'standing' }) {
  // pose: 'standing' | 'pointing' | 'thinking' | 'cheering' | 'sit'
  return (
    <g>
      {/* Hoodie body */}
      <path d="M 100 240 Q 80 240 70 260 L 60 360 Q 60 400 90 408 L 230 408 Q 260 400 260 360 L 250 260 Q 240 240 220 240 Z"
        fill={SAP_NAVY} stroke={SAP_NAVY_DEEP} strokeWidth="2" />
      {/* hoodie center seam shadow */}
      <path d="M 160 240 L 160 408" stroke={SAP_NAVY_DEEP} strokeOpacity="0.3" strokeWidth="0.8" />
      {/* Pocket */}
      <path d="M 110 330 L 210 330 L 220 380 L 100 380 Z" fill={SAP_NAVY_DEEP} opacity="0.35" />
      <line x1="110" y1="330" x2="100" y2="380" stroke={SAP_NAVY_DEEP} strokeOpacity="0.6" strokeWidth="1" />
      <line x1="210" y1="330" x2="220" y2="380" stroke={SAP_NAVY_DEEP} strokeOpacity="0.6" strokeWidth="1" />
      {/* SAP text — bold yellow */}
      <text x="160" y="320" textAnchor="middle"
        fontFamily="Inter, sans-serif" fontWeight="900" fontSize="44"
        fill="#fff" letterSpacing="2">SAP</text>
      {/* hoodie hood at neck */}
      <path d="M 90 250 Q 100 232 130 232 L 190 232 Q 220 232 230 250 L 220 264 Q 160 256 100 264 Z"
        fill={SAP_NAVY_DEEP} />
      {/* Drawstrings */}
      <path d="M 140 250 L 138 274" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M 180 250 L 182 274" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="138" cy="276" r="2.6" fill="#fff" />
      <circle cx="182" cy="276" r="2.6" fill="#fff" />

      {children}
    </g>
  );
}

// ========== Full Panda Sensei standing (main hero variant) ==========
function PandaSensei({ pose = 'pointer', mood = 'happy' }) {
  return (
    <svg viewBox="0 0 360 460" xmlns="http://www.w3.org/2000/svg" aria-label="SAPパンダ先生">
      <defs>
        <radialGradient id="floorShadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,0,0,0.22)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* shadow */}
      <ellipse cx="180" cy="438" rx="110" ry="10" fill="url(#floorShadow)" />

      {/* ====== ARMS BEHIND BODY (so shoulders attach naturally) ====== */}
      {/* Left arm — points outward from shoulder */}
      {(pose === 'book' || pose === 'pointer' || pose === 'present') && (
        <g>
          {/* arm sleeve (hangs down-left) */}
          <path d="M 78 252 Q 50 280 46 340 L 80 348 Q 90 296 110 268 Z"
            fill={SAP_NAVY_LIGHT} stroke={SAP_NAVY_DEEP} strokeWidth="2" />
          {/* paw at end of arm */}
          <ellipse cx="60" cy="346" rx="16" ry="14" fill={PANDA_BLACK} />
          {/* book held in left paw */}
          <g transform="translate(20 322) rotate(-10)">
            <rect width="58" height="42" rx="3" fill="#fff" stroke="#9a8252" strokeWidth="1.8" />
            <rect width="58" height="9" fill={SAP_NAVY} />
            <text x="29" y="7" fontSize="6" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Inter">SAP BOOK</text>
            <rect x="5" y="16" width="48" height="2.5" fill="#cbb98a" />
            <rect x="5" y="22" width="38" height="2" fill="#dac9a0" />
            <rect x="5" y="28" width="44" height="2" fill="#dac9a0" />
            <rect x="5" y="34" width="32" height="2" fill="#dac9a0" />
          </g>
        </g>
      )}

      {/* Right arm — pose-dependent */}
      {pose === 'pointer' && (
        <g>
          {/* arm sleeve extends up-right */}
          <path d="M 242 252 Q 274 240 286 200 L 264 184 Q 246 220 230 244 Z"
            fill={SAP_NAVY_LIGHT} stroke={SAP_NAVY_DEEP} strokeWidth="2" />
          <ellipse cx="282" cy="196" rx="14" ry="13" fill={PANDA_BLACK} />
          {/* wooden pointer */}
          <g transform="translate(286 192) rotate(-32)" className="hand-wave" style={{ transformOrigin: '0px 0px' }}>
            <rect x="0" y="-3" width="100" height="6" rx="2.5" fill="#a8763e" />
            <rect x="0" y="-3" width="100" height="2.5" fill="#c69258" />
            <circle cx="98" cy="0" r="6" fill="#d97548" />
          </g>
        </g>
      )}
      {pose === 'book' && (
        <g>
          {/* right arm down */}
          <path d="M 242 252 Q 268 290 270 350 L 240 354 Q 232 304 226 268 Z"
            fill={SAP_NAVY_LIGHT} stroke={SAP_NAVY_DEEP} strokeWidth="2" />
          <ellipse cx="256" cy="352" rx="14" ry="12" fill={PANDA_BLACK} />
        </g>
      )}
      {pose === 'thinking' && (
        <g>
          {/* right paw to chin */}
          <path d="M 242 252 Q 272 232 264 184 L 240 188 Q 232 220 222 244 Z"
            fill={SAP_NAVY_LIGHT} stroke={SAP_NAVY_DEEP} strokeWidth="2" />
          <ellipse cx="252" cy="188" rx="14" ry="13" fill={PANDA_BLACK} />
        </g>
      )}
      {pose === 'cheer' && (
        <g>
          <path d="M 242 252 Q 282 218 274 170 L 250 174 Q 240 218 224 244 Z"
            fill={SAP_NAVY_LIGHT} stroke={SAP_NAVY_DEEP} strokeWidth="2" />
          <ellipse cx="266" cy="174" rx="14" ry="13" fill={PANDA_BLACK} />
          <text x="278" y="160" fontSize="22" fill="#e8c244">✦</text>
        </g>
      )}
      {pose === 'highfive' && (
        <g>
          <path d="M 242 252 Q 276 220 274 184 L 248 184 Q 244 218 224 244 Z"
            fill={SAP_NAVY_LIGHT} stroke={SAP_NAVY_DEEP} strokeWidth="2" />
          <ellipse cx="270" cy="184" rx="15" ry="13" fill={PANDA_BLACK} />
          <circle cx="265" cy="180" r="2" fill="#5a4332" opacity="0.5" />
          <circle cx="275" cy="178" r="2" fill="#5a4332" opacity="0.5" />
        </g>
      )}
      {pose === 'wave' && (
        <g className="hand-wave" style={{ transformOrigin: '256px 230px' }}>
          <path d="M 242 252 Q 280 220 268 180 L 244 184 Q 240 218 224 244 Z"
            fill={SAP_NAVY_LIGHT} stroke={SAP_NAVY_DEEP} strokeWidth="2" />
          <ellipse cx="258" cy="184" rx="14" ry="13" fill={PANDA_BLACK} />
        </g>
      )}
      {pose === 'present' && (
        <g>
          <path d="M 242 252 Q 286 264 296 286 L 274 304 Q 254 282 232 256 Z"
            fill={SAP_NAVY_LIGHT} stroke={SAP_NAVY_DEEP} strokeWidth="2" />
          <ellipse cx="286" cy="292" rx="14" ry="13" fill={PANDA_BLACK} />
        </g>
      )}

      {/* ===== Body on top of arm attachment region ===== */}
      <PandaBody />

      {/* Head — drawn last so it sits on top */}
      <g transform="translate(110 130)">
        <PandaHeadV2 size={140} mood={mood} wiggleEars={true} />
      </g>
    </svg>
  );
}

// ========== Round avatar Panda (nav, inline) ==========
function PandaAvatar({ size = 40, mouth = 'smile', expression = 'fwd', noCap = false }) {
  return (
    <svg width={size} height={size} viewBox="-4 -8 108 108" xmlns="http://www.w3.org/2000/svg" aria-label="Panda">
      <circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" />
      <PandaHeadV2 size={100} mood={mouth} lookDir={expression} wiggleEars={false} noCap={noCap} />
    </svg>
  );
}

// ========== Dialog avatar (for article speech bubbles) ==========
function PandaDialogAvatar({ size = 64, mood = 'happy' }) {
  return (
    <svg width={size} height={size} viewBox="-6 -10 112 110" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="52" r="46" fill={SAP_NAVY} opacity="0.12" />
      <circle cx="50" cy="52" r="42" fill="#fff" />
      <PandaHeadV2 size={100} mood={mood} lookDir="fwd" wiggleEars={false} />
    </svg>
  );
}

// ========== Thinking pose (used in quiz) ==========
function PandaThinking() {
  return (
    <svg viewBox="0 0 260 320" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="130" cy="312" rx="80" ry="6" fill="#000" opacity="0.2" />
      <g transform="translate(-50 -100) scale(0.72)">
        <PandaSensei pose="thinking" mood="think" />
      </g>
      {/* floating ? marks */}
      <text x="220" y="80" fontFamily="Zen Maru Gothic" fontSize="38" fontWeight="700" fill="#d97548" opacity="0.85" className="qmark q1">?</text>
      <text x="40" y="100" fontFamily="Zen Maru Gothic" fontSize="26" fontWeight="700" fill={SAP_NAVY} opacity="0.7" className="qmark q2">?</text>
      <text x="210" y="140" fontFamily="Zen Maru Gothic" fontSize="22" fontWeight="700" fill="#d96570" opacity="0.7" className="qmark q3">!</text>
    </svg>
  );
}

// ========== Mini chibi peek (module cards) ==========
function PandaPeek() {
  return (
    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      {/* ears */}
      <ellipse cx="22" cy="22" rx="10" ry="9" fill={PANDA_BLACK} />
      <ellipse cx="58" cy="22" rx="10" ry="9" fill={PANDA_BLACK} />
      <ellipse cx="22" cy="22" rx="5" ry="4" fill="#3a2e22" />
      <ellipse cx="58" cy="22" rx="5" ry="4" fill="#3a2e22" />
      {/* face */}
      <ellipse cx="40" cy="44" rx="28" ry="26" fill={FUR_WHITE} />
      {/* mortarboard hint */}
      <ellipse cx="40" cy="20" rx="22" ry="3" fill={SAP_NAVY_DEEP} />
      <path d="M 18 18 L 40 11 L 62 18 L 40 26 Z" fill={SAP_NAVY} />
      {/* sunglasses-style patches */}
      <ellipse cx="28" cy="42" rx="7" ry="7.5" fill={PANDA_BLACK} />
      <ellipse cx="52" cy="42" rx="7" ry="7.5" fill={PANDA_BLACK} />
      {/* glasses */}
      <circle cx="28" cy="42" r="6" fill="none" stroke="#0e0a05" strokeWidth="1.4" />
      <circle cx="52" cy="42" r="6" fill="none" stroke="#0e0a05" strokeWidth="1.4" />
      <line x1="34" y1="42" x2="46" y2="42" stroke="#0e0a05" strokeWidth="1.4" />
      <circle cx="28" cy="42" r="1.8" fill="#fff" />
      <circle cx="52" cy="42" r="1.8" fill="#fff" />
      {/* nose */}
      <ellipse cx="40" cy="52" rx="2.4" ry="1.8" fill={PANDA_BLACK} />
      {/* mouth */}
      <path d="M 34 58 Q 40 63 46 58" fill="none" stroke={PANDA_BLACK} strokeWidth="1.8" strokeLinecap="round" />
      {/* cheek blush */}
      <circle cx="18" cy="52" r="2.6" fill="#f4b8c4" opacity="0.7" />
      <circle cx="62" cy="52" r="2.6" fill="#f4b8c4" opacity="0.7" />
    </svg>
  );
}

// ========== Floating panda greeting button ==========
function PandaFloat() {
  return (
    <svg viewBox="-4 -10 108 108" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="52" r="48" fill="#fff" stroke={SAP_NAVY} strokeWidth="2.5" />
      <PandaHeadV2 size={100} mood="happy" wiggleEars={true} />
      <circle cx="86" cy="20" r="6" fill="#d96570">
        <animate attributeName="r" values="5;6.5;5" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// ============================================================
// たろうくん (Student)
// ============================================================
function StudentHead({ x = 0, y = 0, size = 100, mood = 'smile', lookDir = 'fwd' }) {
  const s = size / 100;
  const offsets = { fwd: [0,0], up: [0,-1], down: [0,1.4], left: [-1.5,0], right: [1.5,0] };
  const [dx, dy] = offsets[lookDir] || [0,0];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Ear (right side, behind hair) */}
      <ellipse cx="86" cy="54" rx="4" ry="6" fill={SKIN} stroke="#c89884" strokeWidth="0.8" />
      {/* Face */}
      <path d="M 50 22 C 28 22 20 38 20 56 C 20 76 32 88 50 88 C 68 88 80 76 80 56 C 80 38 72 22 50 22 Z"
        fill={SKIN} />
      {/* face shading right */}
      <path d="M 64 36 Q 78 50 74 70 Q 70 84 56 87" fill="none" stroke="#e8b89c" strokeWidth="0.8" opacity="0.5" />

      {/* Hair — messy black */}
      <path d="M 18 50 Q 18 16 50 14 Q 84 16 84 52 Q 80 38 70 32 Q 64 42 56 36 Q 52 44 44 36 Q 38 44 30 36 Q 24 44 18 50 Z"
        fill={HAIR} />
      {/* spiky bangs */}
      <path d="M 30 30 Q 36 22 42 32 Q 48 24 54 32 Q 60 22 66 32" fill="none" stroke={HAIR} strokeWidth="3" strokeLinecap="round" />

      {/* Eyes */}
      {mood === 'closed' || mood === 'sleep' ? (
        <>
          <path d="M 32 56 Q 38 53 44 56" fill="none" stroke="#0e0a05" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 56 56 Q 62 53 68 56" fill="none" stroke="#0e0a05" strokeWidth="2.2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Blink cx={38} cy={56} delay={0}>
            <ellipse cx="38" cy="56" rx="2.6" ry="3.6" fill="#0e0a05" />
            <circle cx={37 + dx * 0.6} cy={55 + dy * 0.6} r="0.9" fill="#fff" />
          </Blink>
          <Blink cx={62} cy={56} delay={0.1}>
            <ellipse cx="62" cy="56" rx="2.6" ry="3.6" fill="#0e0a05" />
            <circle cx={61 + dx * 0.6} cy={55 + dy * 0.6} r="0.9" fill="#fff" />
          </Blink>
        </>
      )}
      {/* eyebrows */}
      <path d={mood === 'surprise' ? "M 31 46 Q 38 42 45 46" : "M 32 48 Q 38 46 44 48"} fill="none" stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" />
      <path d={mood === 'surprise' ? "M 55 46 Q 62 42 69 46" : "M 56 48 Q 62 46 68 48"} fill="none" stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" />

      {/* Cheeks */}
      <ellipse cx="28" cy="68" rx="4" ry="2.5" fill="#f4a8b0" opacity="0.55" />
      <ellipse cx="72" cy="68" rx="4" ry="2.5" fill="#f4a8b0" opacity="0.55" />

      {/* Nose hint */}
      <path d="M 50 60 Q 49 64 50 66" fill="none" stroke="#c89884" strokeWidth="1.4" strokeLinecap="round" />

      {/* Mouth */}
      {mood === 'smile' && (
        <path d="M 44 74 Q 50 78 56 74" fill="none" stroke="#0e0a05" strokeWidth="1.8" strokeLinecap="round" />
      )}
      {mood === 'happy' && (
        <>
          <path d="M 42 72 Q 50 82 58 72" fill="#0e0a05" />
          <path d="M 44 74 Q 50 78 56 74" fill="#ff9eb5" />
        </>
      )}
      {mood === 'o' && (
        <ellipse cx="50" cy="76" rx="2.5" ry="3" fill="#0e0a05" />
      )}
      {mood === 'think' && (
        <path d="M 46 76 L 54 76" stroke="#0e0a05" strokeWidth="1.6" strokeLinecap="round" />
      )}
      {mood === 'surprise' && (
        <ellipse cx="50" cy="76" rx="3" ry="4" fill="#0e0a05" />
      )}
      {mood === 'flat' && (
        <line x1="44" y1="76" x2="56" y2="76" stroke="#0e0a05" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </g>
  );
}

// Student full body
function Student({ pose = 'standing', mood = 'happy' }) {
  return (
    <svg viewBox="0 0 320 460" xmlns="http://www.w3.org/2000/svg" aria-label="たろうくん">
      <ellipse cx="160" cy="438" rx="90" ry="8" fill="#000" opacity="0.18" />

      {/* Arms BEHIND body */}
      {pose === 'cheer' && (
        <g>
          {/* right arm up — fist pump */}
          <path d="M 232 254 Q 264 220 254 168 L 232 172 Q 224 220 214 244 Z"
            fill={SHIRT_BLUE} stroke={SHIRT_BLUE_DEEP} strokeWidth="2" />
          <circle cx="244" cy="170" r="14" fill={SKIN} stroke="#c89884" strokeWidth="1" />
          <path d="M 238 164 Q 244 160 250 164" fill="none" stroke="#c89884" strokeWidth="1" />
          {/* left arm down */}
          <path d="M 88 254 Q 64 296 78 348 L 110 350 Q 110 304 122 270 Z"
            fill={SHIRT_BLUE} stroke={SHIRT_BLUE_DEEP} strokeWidth="2" />
          <circle cx="88" cy="348" r="13" fill={SKIN} stroke="#c89884" strokeWidth="1" />
        </g>
      )}
      {pose === 'laptop' && (
        <g>
          <path d="M 100 256 Q 78 296 88 340 L 130 344 Q 122 312 130 280 Z"
            fill={SHIRT_BLUE} stroke={SHIRT_BLUE_DEEP} strokeWidth="2" />
          <path d="M 220 256 Q 242 296 232 340 L 190 344 Q 198 312 190 280 Z"
            fill={SHIRT_BLUE} stroke={SHIRT_BLUE_DEEP} strokeWidth="2" />
          {/* hands */}
          <ellipse cx="118" cy="346" rx="14" ry="9" fill={SKIN} stroke="#c89884" strokeWidth="1" />
          <ellipse cx="202" cy="346" rx="14" ry="9" fill={SKIN} stroke="#c89884" strokeWidth="1" />
          {/* Laptop */}
          <g transform="translate(160 360)">
            <rect x="-66" y="-8" width="132" height="8" rx="2" fill="#9ca3b0" />
            <rect x="-60" y="-44" width="120" height="40" rx="3" fill="#252c39" stroke="#9ca3b0" strokeWidth="2" />
            <rect x="-56" y="-40" width="112" height="34" rx="2" fill="#3a4358" />
            <rect x="-50" y="-34" width="60" height="3" fill="#7ad2c0" opacity="0.7" />
            <rect x="-50" y="-28" width="80" height="2" fill="#cbd5e1" opacity="0.5" />
            <rect x="-50" y="-22" width="50" height="2" fill="#cbd5e1" opacity="0.5" />
            <rect x="-50" y="-16" width="70" height="2" fill="#cbd5e1" opacity="0.5" />
            <text x="-40" y="-9" fontSize="5" fill="#fff" opacity="0.6" fontFamily="JetBrains Mono">SAP.com</text>
          </g>
        </g>
      )}
      {pose === 'highfive' && (
        <g>
          {/* left arm raised — palm */}
          <path d="M 88 254 Q 56 220 66 178 L 90 184 Q 94 218 110 240 Z"
            fill={SHIRT_BLUE} stroke={SHIRT_BLUE_DEEP} strokeWidth="2" />
          <circle cx="72" cy="182" r="14" fill={SKIN} stroke="#c89884" strokeWidth="1" />
          <path d="M 66 178 L 64 168 M 72 174 L 70 164 M 78 178 L 80 168" stroke="#c89884" strokeWidth="1.2" strokeLinecap="round" />
          {/* right arm down */}
          <path d="M 232 254 Q 256 298 240 348 L 208 350 Q 208 306 198 272 Z"
            fill={SHIRT_BLUE} stroke={SHIRT_BLUE_DEEP} strokeWidth="2" />
          <circle cx="232" cy="346" r="13" fill={SKIN} stroke="#c89884" strokeWidth="1" />
        </g>
      )}
      {pose === 'thinking' && (
        <g>
          <path d="M 232 254 Q 264 230 252 198 L 230 200 Q 224 226 214 244 Z"
            fill={SHIRT_BLUE} stroke={SHIRT_BLUE_DEEP} strokeWidth="2" />
          <circle cx="244" cy="200" r="13" fill={SKIN} stroke="#c89884" strokeWidth="1" />
          <path d="M 88 254 Q 64 298 78 348 L 110 350 Q 110 304 122 270 Z"
            fill={SHIRT_BLUE} stroke={SHIRT_BLUE_DEEP} strokeWidth="2" />
          <circle cx="88" cy="346" r="13" fill={SKIN} stroke="#c89884" strokeWidth="1" />
        </g>
      )}
      {pose === 'standing' && (
        <g>
          <path d="M 88 254 Q 64 298 80 350 L 112 352 Q 112 304 122 270 Z"
            fill={SHIRT_BLUE} stroke={SHIRT_BLUE_DEEP} strokeWidth="2" />
          <circle cx="88" cy="348" r="13" fill={SKIN} stroke="#c89884" strokeWidth="1" />
          <path d="M 232 254 Q 256 298 240 350 L 208 352 Q 208 304 198 270 Z"
            fill={SHIRT_BLUE} stroke={SHIRT_BLUE_DEEP} strokeWidth="2" />
          <circle cx="232" cy="348" r="13" fill={SKIN} stroke="#c89884" strokeWidth="1" />
        </g>
      )}

      {/* Hoodie body */}
      <path d="M 100 240 Q 84 244 76 260 L 66 360 Q 66 400 96 408 L 224 408 Q 254 400 254 360 L 244 260 Q 236 244 220 240 Z"
        fill={SHIRT_BLUE} stroke={SHIRT_BLUE_DEEP} strokeWidth="2" />
      {/* hood */}
      <path d="M 90 252 Q 100 232 130 232 L 190 232 Q 220 232 230 252 L 222 268 Q 160 256 98 268 Z" fill={SHIRT_BLUE_DEEP} />
      {/* pocket */}
      <path d="M 112 332 L 208 332 L 218 380 L 102 380 Z" fill={SHIRT_BLUE_DEEP} opacity="0.4" />
      <line x1="112" y1="332" x2="102" y2="380" stroke={SHIRT_BLUE_DEEP} strokeWidth="1" />
      <line x1="208" y1="332" x2="218" y2="380" stroke={SHIRT_BLUE_DEEP} strokeWidth="1" />
      {/* drawstrings */}
      <path d="M 142 252 L 140 276" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M 178 252 L 180 276" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="140" cy="278" r="2.4" fill="#fff" />
      <circle cx="180" cy="278" r="2.4" fill="#fff" />

      {/* Neck */}
      <rect x="142" y="228" width="36" height="20" fill={SKIN} stroke="#c89884" strokeWidth="0.8" />

      {/* Head */}
      <g transform="translate(110 150)">
        <StudentHead size={100} mood={mood} />
      </g>
    </svg>
  );
}

function StudentAvatar({ size = 40, mouth = 'smile', expression = 'fwd' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="52" r="46" fill={SHIRT_BLUE} opacity="0.18" />
      <circle cx="50" cy="52" r="42" fill="#fff" />
      <StudentHead size={100} mood={mouth} lookDir={expression} />
    </svg>
  );
}

function StudentDialogAvatar({ size = 64, mood = 'happy' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="52" r="46" fill={SHIRT_BLUE} opacity="0.12" />
      <circle cx="50" cy="52" r="42" fill="#fff" />
      <StudentHead size={100} mood={mood} />
    </svg>
  );
}

// ============================================================
// Scene compositions — Panda + Taro together
// ============================================================
function SceneBlackboard() {
  // Panda points at FI/CO/MM/SD diagram on whiteboard, Taro watches
  return (
    <svg viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg" aria-label="Module diagram explanation">
      <ellipse cx="360" cy="440" rx="220" ry="10" fill="#000" opacity="0.18" />
      {/* Whiteboard center */}
      <g transform="translate(280 70)">
        <rect x="-90" y="-10" width="240" height="180" rx="6" fill="#fff" stroke="#9aa1b5" strokeWidth="3" />
        <rect x="-90" y="-10" width="240" height="14" fill="#cbd1de" />
        {/* Module nodes */}
        {[
          { x: -40, y: 36, code: 'FI', color: '#2f6d44' },
          { x: 90, y: 36, code: 'CO', color: '#2641a1' },
          { x: -40, y: 110, code: 'MM', color: '#a25411' },
          { x: 90, y: 110, code: 'SD', color: '#b62a4a' }
        ].map((m, i) => (
          <g key={i}>
            <rect x={m.x - 22} y={m.y - 16} width="44" height="32" rx="4" fill={m.color} />
            <text x={m.x} y={m.y + 6} fontSize="16" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Inter">{m.code}</text>
          </g>
        ))}
        {/* connecting lines */}
        <line x1="-18" y1="36" x2="68" y2="36" stroke="#9aa1b5" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="-40" y1="52" x2="-40" y2="94" stroke="#9aa1b5" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="90" y1="52" x2="90" y2="94" stroke="#9aa1b5" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="-18" y1="110" x2="68" y2="110" stroke="#9aa1b5" strokeWidth="1.5" strokeDasharray="3,3" />
      </g>
      {/* Panda on left, pointing at board */}
      <g transform="translate(20 60) scale(0.78)">
        <PandaSensei pose="pointer" mood="happy" />
      </g>
      {/* Taro on right, watching */}
      <g transform="translate(460 70) scale(0.75)">
        <Student pose="thinking" mood="o" />
      </g>
      {/* Speech */}
      <g transform="translate(560 36)">
        <rect x="-58" y="-18" width="124" height="36" rx="14" fill="#fff" stroke={SAP_NAVY} strokeWidth="1.5" />
        <path d="M -30 12 L -36 22 L -20 16 Z" fill="#fff" stroke={SAP_NAVY} strokeWidth="1.5" />
        <text x="0" y="6" fontSize="13" fill="#0e0a05" textAnchor="middle" fontFamily="Zen Maru Gothic" fontWeight="700">なるほど〜！</text>
      </g>
    </svg>
  );
}

function SceneLearning() {
  // Panda + Taro side by side studying with laptop
  return (
    <svg viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="360" cy="440" rx="220" ry="10" fill="#000" opacity="0.18" />
      {/* Desk */}
      <rect x="80" y="380" width="560" height="14" fill="#c69a6e" rx="3" />
      <rect x="80" y="394" width="560" height="6" fill="#a87d56" />
      {/* Books left */}
      <g transform="translate(110 350)">
        <rect width="34" height="32" fill="#d97548" rx="2" />
        <text x="17" y="20" textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff" fontFamily="Inter">FI</text>
        <rect x="-2" y="-12" width="38" height="14" fill="#5a9d6e" rx="2" />
        <text x="17" y="-2" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff" fontFamily="Inter">MM</text>
      </g>
      {/* Panda left, with book */}
      <g transform="translate(30 60) scale(0.78)">
        <PandaSensei pose="book" mood="happy" />
      </g>
      {/* Taro right, with laptop */}
      <g transform="translate(380 60) scale(0.78)">
        <Student pose="laptop" mood="happy" />
      </g>
      {/* Sparkles */}
      <g fill="#e8c244" opacity="0.85">
        <text x="320" y="80" fontSize="18">✦</text>
        <text x="600" y="120" fontSize="14">✦</text>
        <text x="200" y="150" fontSize="12">✦</text>
      </g>
    </svg>
  );
}

function SceneHighFive() {
  // Both characters high-fiving
  return (
    <svg viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="360" cy="440" rx="220" ry="10" fill="#000" opacity="0.18" />
      <g transform="translate(60 60) scale(0.78)">
        <PandaSensei pose="highfive" mood="laugh" />
      </g>
      <g transform="translate(370 60) scale(0.78)">
        <Student pose="highfive" mood="happy" />
      </g>
      {/* Burst */}
      <g transform="translate(360 200)">
        <g opacity="0.85">
          <text x="0" y="-30" fontSize="28" fill="#e8c244" textAnchor="middle">✦</text>
          <text x="-40" y="0" fontSize="22" fill="#d97548" textAnchor="middle">✦</text>
          <text x="40" y="0" fontSize="22" fill="#d97548" textAnchor="middle">✦</text>
          <text x="0" y="40" fontSize="18" fill="#5a9d6e" textAnchor="middle">✦</text>
        </g>
      </g>
      {/* Speech */}
      <g transform="translate(360 36)">
        <rect x="-64" y="-18" width="128" height="36" rx="14" fill="#fff" stroke="#d97548" strokeWidth="1.8" />
        <path d="M -6 16 L 0 26 L 6 16 Z" fill="#fff" stroke="#d97548" strokeWidth="1.8" />
        <text x="0" y="6" fontSize="13" fill="#0e0a05" textAnchor="middle" fontFamily="Zen Maru Gothic" fontWeight="700">よくできたね！</text>
      </g>
    </svg>
  );
}

function ScenePresentClass() {
  // Single full-frame Hero scene — Panda teaching, Taro raised hand
  return (
    <svg viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="360" cy="440" rx="220" ry="10" fill="#000" opacity="0.18" />
      <g transform="translate(40 60) scale(0.78)">
        <PandaSensei pose="pointer" mood="happy" />
      </g>
      <g transform="translate(420 80) scale(0.7)">
        <Student pose="cheer" mood="happy" />
      </g>
      {/* Speech bubble */}
      <g transform="translate(620 50)">
        <rect x="-50" y="-18" width="100" height="36" rx="14" fill="#fff" stroke={SHIRT_BLUE_DEEP} strokeWidth="1.5" />
        <path d="M -26 12 L -30 24 L -16 16 Z" fill="#fff" stroke={SHIRT_BLUE_DEEP} strokeWidth="1.5" />
        <text x="0" y="6" fontSize="13" fill="#0e0a05" textAnchor="middle" fontFamily="Zen Maru Gothic" fontWeight="700">がんばるぞ！</text>
      </g>
    </svg>
  );
}

// Pick scene by name — for variation per article
function Scene({ name = 'class' }) {
  switch (name) {
    case 'blackboard': return <SceneBlackboard />;
    case 'learning': return <SceneLearning />;
    case 'highfive': return <SceneHighFive />;
    case 'class':
    default: return <ScenePresentClass />;
  }
}

// PandaTeacher kept as alias for hero (backward compatibility)
function PandaTeacher() {
  return <PandaSensei pose="pointer" mood="happy" />;
}

// Export
Object.assign(window, {
  PandaTeacher, PandaSensei, PandaAvatar, PandaDialogAvatar, PandaThinking, PandaPeek, PandaFloat,
  Student, StudentAvatar, StudentDialogAvatar, StudentHead,
  Scene, SceneBlackboard, SceneLearning, SceneHighFive, ScenePresentClass,
  PandaHeadV2, PandaHead: PandaHeadV2
});
