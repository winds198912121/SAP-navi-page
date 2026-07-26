'use client'
// ===========================================================
// FloatingPanda — 右下に浮かぶパンダ先生ウィジェット
// ===========================================================
import { useState } from 'react'

interface ThemeSettings {
  palette: 'bamboo' | 'warm' | 'fresh'
  reading: number
  intensity: 'off' | 'light' | 'medium'
  showFloatingPanda: boolean
}

function getSettings(): ThemeSettings {
  if (typeof window === 'undefined') return { palette: 'bamboo', reading: 1, intensity: 'medium', showFloatingPanda: true }
  try {
    const raw = localStorage.getItem('sap_panda_theme')
    if (raw) return JSON.parse(raw)
  } catch {}
  return { palette: 'bamboo', reading: 1, intensity: 'medium', showFloatingPanda: true }
}

function saveSettings(s: ThemeSettings) {
  try { localStorage.setItem('sap_panda_theme', JSON.stringify(s)) } catch {}
}

export default function FloatingPanda() {
  const [settings, setSettings] = useState<ThemeSettings>(getSettings)
  const [showTweaks, setShowTweaks] = useState(false)

  const updateSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    const next = { ...settings, [key]: value }
    setSettings(next)
    saveSettings(next)
    if (key === 'palette') document.documentElement.setAttribute('data-theme', value as string)
    if (key === 'reading') document.documentElement.style.setProperty('--reading', String(value))
    if (key === 'intensity') document.documentElement.setAttribute('data-intensity', value as string)
  }

  return (
    <>
      {/* Panda button */}
      <div className="float-panda" onClick={() => setShowTweaks(!showTweaks)}
        style={{ fontSize: 48, lineHeight: 1, textAlign: 'center', userSelect: 'none' }}>
        🐼
      </div>

      {/* Tweaks panel */}
      {showTweaks && (
        <div className="tweaks-panel">
          <div className="tweak-section">
            <div className="tweak-label">カラーテーマ</div>
            <div className="tweak-radio">
              {(['bamboo', 'warm', 'fresh'] as const).map(p => (
                <button key={p} className={settings.palette === p ? 'active' : ''}
                  onClick={() => updateSetting('palette', p)}>
                  {p === 'bamboo' ? '竹林' : p === 'warm' ? '温暖' : '清新'}
                </button>
              ))}
            </div>
          </div>
          <div className="tweak-section">
            <div className="tweak-label">アニメ強度</div>
            <div className="tweak-radio">
              {(['off', 'light', 'medium'] as const).map(v => (
                <button key={v} className={settings.intensity === v ? 'active' : ''}
                  onClick={() => updateSetting('intensity', v)}>
                  {v === 'off' ? 'OFF' : v === 'light' ? '弱' : '中'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
