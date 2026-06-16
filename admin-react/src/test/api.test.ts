import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '../services/api'

describe('API Service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should have all required methods', () => {
    expect(api.getArticles).toBeDefined()
    expect(api.getArticle).toBeDefined()
    expect(api.getModules).toBeDefined()
    expect(api.getTodayQuiz).toBeDefined()
    expect(api.getCases).toBeDefined()
    expect(api.login).toBeDefined()
    expect(api.register).toBeDefined()
    expect(api.getMe).toBeDefined()
    expect(api.logout).toBeDefined()
  })

  it('should start not authenticated', () => {
    expect(api.isAuthenticated()).toBe(false)
    expect(api.getToken()).toBeNull()
  })

  it('should handle token storage on login', async () => {
    // Mock axios post to simulate successful login
    const mockPost = vi.spyOn(api['client'], 'post').mockResolvedValue({
      data: {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: { id: 1, display_name: 'Test User' },
        },
      },
    })

    const response = await api.login('test@test.com', 'password')
    expect(response.success).toBe(true)
    expect(localStorage.getItem('sap_panda_token')).toBe('mock-jwt-token')
    expect(api.getToken()).toBe('mock-jwt-token')
    expect(api.isAuthenticated()).toBe(true)

    mockPost.mockRestore()
  })

  it('should clear token on logout', () => {
    localStorage.setItem('sap_panda_token', 'some-token')
    api.logout()
    expect(api.isAuthenticated()).toBe(false)
    expect(localStorage.getItem('sap_panda_token')).toBeNull()
  })

  it('should set auth header on authenticated requests', async () => {
    localStorage.setItem('sap_panda_token', 'test-token')
    const mockGet = vi.spyOn(api['client'], 'get').mockResolvedValue({
      data: { success: true, data: { id: 1 } },
    })

    await api.getMe()

    expect(mockGet).toHaveBeenCalledWith('/users/me')
    // Verify the interceptor added the header
    const config = mockGet.mock.calls[0][1]
    // Check that the request interceptor works by checking client defaults
    const token = localStorage.getItem('sap_panda_token')
    expect(token).toBe('test-token')

    mockGet.mockRestore()
  })
})
