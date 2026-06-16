import { describe, it, expect } from 'vitest'
import { SAP_MODULES, LEARNING_PATHS, QUIZ_DATA, NAV_LINKS } from '../types'

describe('SAP Modules', () => {
  it('should have 9 SAP modules', () => {
    expect(SAP_MODULES).toHaveLength(9)
  })

  it('each module should have required fields', () => {
    for (const m of SAP_MODULES) {
      expect(m.slug).toBeDefined()
      expect(m.code).toBeDefined()
      expect(m.name_ja).toBeDefined()
      expect(m.name_en).toBeDefined()
      expect(m.color).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it('should include FI, CO, MM modules', () => {
    const codes = SAP_MODULES.map(m => m.code)
    expect(codes).toContain('FI')
    expect(codes).toContain('CO')
    expect(codes).toContain('MM')
    expect(codes).toContain('ABAP')
    expect(codes).toContain('S/4')
  })
})

describe('Learning Paths', () => {
  it('should have 3 learning paths', () => {
    expect(LEARNING_PATHS).toHaveLength(3)
  })

  it('each path should have steps', () => {
    for (const p of LEARNING_PATHS) {
      expect(p.steps.length).toBeGreaterThanOrEqual(1)
      expect(p.duration).toBeDefined()
    }
  })
})

describe('Quiz Data', () => {
  it('should have quiz questions with correct structure', () => {
    for (const q of QUIZ_DATA) {
      expect(q.question).toBeDefined()
      expect(q.options).toHaveLength(4)
      expect(q.correct).toBeGreaterThanOrEqual(0)
      expect(q.correct).toBeLessThan(4)
      expect(q.explanation).toBeDefined()
    }
  })
})

describe('Navigation', () => {
  it('should have navigation links', () => {
    expect(NAV_LINKS.length).toBeGreaterThanOrEqual(5)
    expect(NAV_LINKS[0].id).toBe('home')
  })
})
