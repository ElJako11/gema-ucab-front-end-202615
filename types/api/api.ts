// types/api.ts

import { UbicacionTecnica, PadreUbicacion } from '@/types/models/ubicacionesTecnicas.types';
import { Tecnico } from '@/types/models/tecnicos.types';
import { GrupoTrabajo } from '@/types/models/gruposTrabajo.types';

// Respuesta estándar de la API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status?: number;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Configuración de peticiones
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  requiresAuth?: boolean;
}

// Error estándar de la API
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Interfaz del API Client
export interface ApiClient {
  get<T = any>(url: string, config?: RequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: RequestConfig): Promise<T>;
}




/**
 * TIPOS ESPECÍFICOS PARA LOS COMPONENTES
 */

// Ubicaciones técnicas
export interface UbicacionesTecnicasResponse extends ApiResponse<UbicacionTecnica[]> {}
export interface PadresUbicacionResponse extends ApiResponse<PadreUbicacion[]> {}

// Técnicos
export interface TecnicosResponse extends ApiResponse<Tecnico[]> {}

// Grupos de trabajo
export interface GruposTrabajoResponse extends ApiResponse<GrupoTrabajo[]> {}
export interface TrabajadoresPorGrupoItem {
  grupoDeTrabajoId: number;
  usuarios: Tecnico[];
}

export interface TrabajadoresPorGrupoResponse extends ApiResponse<TrabajadoresPorGrupoItem[]> {}

/**
 * Tipos para mutaciones (crear, editar, eliminar)
 */
export interface CreateTecnicoRequest {
  Nombre: string;
  Correo: string;
}

export interface CreateGrupoRequest {
  codigo: string;
  nombre: string;
  supervisorId: number;
}

export interface UpdateGrupoRequest extends CreateGrupoRequest {
  id: number;
}

/**
 * Helper types para React Query
 */
export type QueryResponse<T> = ApiResponse<T>;
export type MutationResponse<T = any> = ApiResponse<T>;

// Tipos para creación de ubicaciones
export interface CreateUbicacionTecnicaPayload {
  descripcion: string;
  abreviacion: string;
  padres?: { idPadre: number; esUbicacionFisica?: boolean }[];
}

export interface CreateUbicacionResponse extends ApiResponse<{
  message: string;
  ubicacion: UbicacionTecnica;
}> {}
