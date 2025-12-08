// Usuario que viene del backend
export interface User {
  Id: number;
  Nombre: string;
  Correo: string;
  Tipo: string;
}

// Datos para login
export interface LoginRequest {
  Correo: string;
  Contraseña: string;
}

// Respuesta del endpoint de login
export interface AuthResponse {
  data: {
    token: string;
    usuario: User;
  }
}

// Estado de autenticación
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}