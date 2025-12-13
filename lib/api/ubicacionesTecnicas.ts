import apiClient from "./client";
import type { UbicacionTecnica } from "@/types/models/ubicacionesTecnicas.types";

// =================== INTERFACES ===================
export interface UbicacionesTecnicasResponse {
  data: UbicacionTecnica[];
}

export interface CreateUbicacionTecnicaRequest {
  descripcion: string;
  abreviacion: string;
  padres?: Array<{
    idPadre: number;
    esUbicacionFisica?: boolean;
    estaHabilitado?: boolean;
  }>;
}

export interface UpdateUbicacionTecnicaRequest {
  descripcion?: string;
  abreviacion?: string;
  padres?: Array<{
    idPadre: number;
    esUbicacionFisica?: boolean;
    estaHabilitado?: boolean;
  }>;
}

export interface PadresResponse {
  data: UbicacionTecnica[];
}

// =================== API ===================
export const ubicacionesTecnicasAPI = {
  /**
   * Obtiene todas las ubicaciones técnicas en forma jerárquica.
   */
  async getAll(): Promise<UbicacionesTecnicasResponse> {
    return apiClient.get<UbicacionesTecnicasResponse>("/ubicaciones-tecnicas");
  },

  /**
   * Obtiene las ubicaciones técnicas dependientes de una ubicación dada.
   */
  async getDependientes(
    id: number,
    nivel?: number
  ): Promise<UbicacionesTecnicasResponse> {
    const url = nivel !== undefined
      ? `/ubicaciones-tecnicas/ramas/${id}?nivel=${nivel}`
      : `/ubicaciones-tecnicas/ramas/${id}`;

    return apiClient.get<UbicacionesTecnicasResponse>(url);
  },

  /**
   * Crea una nueva ubicación técnica.
   */
  async create(data: CreateUbicacionTecnicaRequest): Promise<UbicacionTecnica> {
    return apiClient.post<UbicacionTecnica>("/ubicaciones-tecnicas", data);
  },

  /**
   * Actualiza una ubicación técnica.
   */
  async update(
    id: number,
    data: UpdateUbicacionTecnicaRequest
  ): Promise<UbicacionTecnica> {
    return apiClient.put<UbicacionTecnica>(`/ubicaciones-tecnicas/${id}`, data);
  },

  /**
   * Elimina una ubicación técnica.
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/ubicaciones-tecnicas/${id}`);
  },

  /**
   * Obtiene los padres directos de una ubicación técnica.
   */
  async getPadres(idHijo: number): Promise<PadresResponse> {
    return apiClient.get<PadresResponse>(`/ubicaciones-tecnicas/padres/${idHijo}`);
  },

  /**
   * Obtiene las ubicaciones técnicas de un nivel específico.
   */
  async getByNivel(nivel: number): Promise<UbicacionesTecnicasResponse> {
    return apiClient.get<UbicacionesTecnicasResponse>(`/ubicaciones-tecnicas/nivel/${nivel}`);
  },
};