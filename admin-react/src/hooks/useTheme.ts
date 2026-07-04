import { useState, useEffect, useCallback } from 'react'
import type { ThemeSettings } from '../types'

const STORAGE_KEY = 'sap_panda_theme'

const DEFAULT: ThemeSettings = {
  palette: 'bamboo',
  reading: 1,
  intensity: 'medium',
  showFloatingPanda: true,
}

function load(): ThemeSettings {
  // SSR 時は window / localStorage が利用不可
  if (typeof window === 'undefined') return DEFAULT
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT
  } catch {
    return DEFAULT
  }
}

function apply(s: ThemeSettings) {
  const root = document.documentElement
  root.dataset.theme = s.palette
  root.style.setProperty('--reading', String(s.reading))
  root.dataset.intensity = s.intensity
}

export function useTheme() {
  const [settings, setSettings] = useState<ThemeSettings>(load)

  useEffect(() => {
    apply(settings)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) document.documentElement.dataset.intensity = 'off'
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.dataset.intensity = e.matches ? 'off' : settings.intensity
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [settings.intensity])

  const update = useCallback(<K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  return { settings, updateSetting: update }
}
