// lib/auth/context.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { User, LoginRequest, AuthResponse } from '@/types/auth'
import { AuthContextType } from '@/types/context'
import { authAPI } from '@/lib/api/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!user && !!token;

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      setError(null) 
      const response: AuthResponse = await authAPI.login(credentials)
      
      setToken(response.token)
      setUser(response.user)
      
      // ✅ Solo en cliente
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', response.token)
        if (response.refreshToken) {
          localStorage.setItem('refresh-token', response.refreshToken)
        }
      }

    } catch (err: any) {
      setError(err.message || 'Error during login')
      throw err // ← Corregí esto: era 'throw error'
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    // ✅ Solo en cliente
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('refresh-token')
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      // ✅ Verificar que estamos en el cliente
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      try {
        const savedToken = localStorage.getItem('auth-token')
        if (savedToken) {
          const userData = await authAPI.verifyToken(savedToken)
          setUser(userData)
          setToken(savedToken)
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated,
    error,
    clearError: () => setError(null),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}