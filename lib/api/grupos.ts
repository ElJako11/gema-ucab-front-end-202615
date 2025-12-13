import apiClient from "./client";
import type { GrupoTrabajo } from "@/types/grupostrabajo.types";

// =================== INTERFACES ===================
export interface GruposResponse {
  data: GrupoTrabajo[];
}

export interface GrupoResponse {
  data: GrupoTrabajo;
}

export interface CreateGrupoRequest {
  codigo: string;
  nombre: string;
  supervisorId: number;
  area: string;
}

export interface UpdateGrupoRequest {
  codigo?: string;
  nombre?: string;
  supervisorId?: number;
  area?: string;
}

// =================== API ===================
export const gruposAPI = {
  /**
   * Obtiene todos los grupos de trabajo.
   */
  async getAll(): Promise<GruposResponse> {
    return apiClient.get<GruposResponse>("/grupos");
  },

  /**
   * Obtiene un grupo de trabajo por ID.
   */
  async getById(id: number): Promise<GrupoResponse> {
    return apiClient.get<GrupoResponse>(`/grupos/${id}`);
  },

  /**
   * Crea un nuevo grupo de trabajo.
   */
  async create(data: CreateGrupoRequest): Promise<GrupoTrabajo> {
    return apiClient.post<GrupoTrabajo>("/grupos", data);
  },

  /**
   * Actualiza un grupo de trabajo.
   */
  async update(id: number, data: UpdateGrupoRequest): Promise<GrupoTrabajo> {
    return apiClient.put<GrupoTrabajo>(`/grupos/${id}`, data);
  },

  /**
   * Elimina un grupo de trabajo.
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/grupos/${id}`);
  },
};