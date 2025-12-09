// lib/auth/context.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api/auth'
import { LoginRequest, User } from '@/types/auth'

interface AuthContextType {
  user: User | null
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  clearError: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const isAuthenticated = !!user

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authAPI.login(credentials)

      // Usar los datos del usuario que vienen en la respuesta del login
      setUser(response.data.usuario)

      router.push('/ubicaciones-tecnicas')

    } catch (err: any) {
      const errorMessage = err.message || 'Error en el inicio de sesión'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      setUser(null)
      setError(null)
      router.push('/login')
    }
  }

  const checkAuth = async () => {
    try {
      const userData = await authAPI.getCurrentUser()
      setUser(userData)
    } catch (error) {
      setUser(null)
      // No redirigir aquí, dejar que el middleware o ProtectedRoute lo maneje
    }
  }

  // Verificar autenticación al cargar
  // TODO: Descomentar cuando el backend implemente /auth/me
  useEffect(() => {
    const initializeAuth = async () => {
      // await checkAuth()  // Comentado temporalmente - backend no tiene /auth/me aún
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated,
    error,
    clearError: () => setError(null),
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}