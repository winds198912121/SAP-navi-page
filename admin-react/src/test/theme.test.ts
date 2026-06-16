import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../hooks/useTheme'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock matchMedia for reduced motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
})

describe('useTheme Hook', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.dataset.theme = ''
    document.documentElement.style.setProperty('--reading', '1')
    document.documentElement.dataset.intensity = ''
  })

  it('should return default theme settings', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.settings.palette).toBe('bamboo')
    expect(result.current.settings.reading).toBe(1)
    expect(result.current.settings.intensity).toBe('medium')
    expect(result.current.settings.showFloatingPanda).toBe(true)
  })

  it('should persist settings to localStorage', () => {
    const { result } = renderHook(() => useTheme())
    const stored = JSON.parse(localStorage.getItem('sap_panda_theme') || '{}')
    expect(stored.palette).toBe('bamboo')
  })

  it('should update palette theme', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.updateSetting('palette', 'warm')
    })

    expect(result.current.settings.palette).toBe('warm')
    expect(document.documentElement.dataset.theme).toBe('warm')
  })

  it('should update animation intensity', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.updateSetting('intensity', 'off')
    })

    expect(result.current.settings.intensity).toBe('off')
    expect(document.documentElement.dataset.intensity).toBe('off')
  })

  it('should update reading size', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.updateSetting('reading', 1.2)
    })

    expect(result.current.settings.reading).toBe(1.2)
  })

  it('should toggle floating panda', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.updateSetting('showFloatingPanda', false)
    })

    expect(result.current.settings.showFloatingPanda).toBe(false)
  })

  it('should load saved settings from localStorage', () => {
    localStorage.setItem('sap_panda_theme', JSON.stringify({
      palette: 'fresh',
      reading: 1.15,
      intensity: 'light',
      showFloatingPanda: false,
    }))

    const { result } = renderHook(() => useTheme())
    expect(result.current.settings.palette).toBe('fresh')
    expect(result.current.settings.reading).toBe(1.15)
    expect(result.current.settings.intensity).toBe('light')
    expect(result.current.settings.showFloatingPanda).toBe(false)
  })
})
