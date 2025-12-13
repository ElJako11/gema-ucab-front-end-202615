// lib/api/auth.ts
import { LoginRequest, AuthResponse, User } from '@/types/auth'
import apiClient from './client'

export const authAPI = {

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Formatear exactamente como espera el backend
    const formattedCredentials = {
      Correo: credentials.Correo,
      Contraseña: credentials.Contraseña
    }

    // Las cookies se manejan automáticamente
    const response = await apiClient.post<AuthResponse>('/auth/login', formattedCredentials)
    return response
  },

  async getCurrentUser(): Promise<User> {
    // El backend valida automáticamente la cookie
    const response = await apiClient.get<User>('/auth/me')
    return response
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
    // El backend debe limpiar la cookie
  },

  async verifyAuth(): Promise<boolean> {
    try {
      await apiClient.get('/auth/verify')
      return true
    } catch {
      return false
    }
  }
}