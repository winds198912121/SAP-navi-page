// ===========================================================
// Auth Context — 全局认证状态管理 (T2.1.2.1)
// ===========================================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import api from '../services/api'

export interface AuthUser {
  id: number
  email: string
  displayName: string
  description?: string
  url?: string
  avatarUrl?: string
  roles: string[]
  memberSince?: string
  stats?: {
    articlesRead: number
    quizzesAnswered: number
    quizAccuracy: number
    points: number
    bookmarks: number
  }
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, displayName: string) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
  updateProfile: (data: Partial<AuthUser>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    if (!api.isAuthenticated()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const res = await api.getMe()
      if (res.success && res.data) {
        const d = res.data
        setUser({
          id: d.id,
          email: d.email,
          displayName: d.display_name,
          description: d.description || '',
          url: d.url || '',
          avatarUrl: d.avatar_url,
          roles: d.roles || [],
          memberSince: d.member_since,
          stats: d.stats || {
            articlesRead: 0, quizzesAnswered: 0, quizAccuracy: 0, points: 0, bookmarks: 0,
          },
        })
      }
    } catch {
      api.logout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUser() }, [fetchUser])

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null)
    setLoading(true)
    try {
      const res = await api.login(email, password)
      if (res.success) {
        await fetchUser()
        return true
      }
      setError(res.message || 'ログインに失敗しました。')
      return false
    } catch (e: any) {
      setError(e.response?.data?.message || 'サーバーエラーが発生しました。')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, displayName: string): Promise<boolean> => {
    setError(null)
    setLoading(true)
    try {
      const res = await api.register({ email, password, display_name: displayName })
      if (res.success) {
        // Auto login after register
        return await login(email, password)
      }
      setError(res.message || '登録に失敗しました。')
      return false
    } catch (e: any) {
      setError(e.response?.data?.message || 'サーバーエラーが発生しました。')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    api.logout()
    setUser(null)
  }

  const updateProfile = async (data: Partial<AuthUser>): Promise<boolean> => {
    setLoading(true)
    try {
      const res = await api.updateMe({
        display_name: data.displayName,
        description: data.description,
        url: data.url,
      })
      if (res.success) {
        await fetchUser()
        return true
      }
      return false
    } catch {
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, refreshUser: fetchUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
