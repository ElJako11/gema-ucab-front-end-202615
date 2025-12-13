import apiClient from "./client";
import type { Usuario } from "@/types/usuarios.types";

// =================== INTERFACES ===================
export interface AsignacionGrupoResponse {
  data: {
    grupoDeTrabajoId: number;
    usuarios: Usuario[];
  }[];
}

export interface AsignacionGrupoEspecificoResponse {
  data: {
    grupoDeTrabajoId: number;
    usuarios: Usuario[];
  };
}

export interface CreateAsignacionRequest {
  tecnicoId: number;
  grupoDeTrabajoId: number;
}

// =================== API ===================
export const asignacionGruposAPI = {
  /**
   * Obtiene todos los grupos con sus técnicos asignados.
   */
  async getAll(): Promise<AsignacionGrupoResponse> {
    return apiClient.get<AsignacionGrupoResponse>("/trabajaEnGrupo");
  },

  /**
   * Obtiene los técnicos asignados a un grupo específico.
   */
  async getByGrupoId(grupoId: number): Promise<AsignacionGrupoEspecificoResponse> {
    return apiClient.get<AsignacionGrupoEspecificoResponse>(`/trabajaEnGrupo/${grupoId}`);
  },

  /**
   * Asigna un técnico a un grupo.
   */
  async create(data: CreateAsignacionRequest): Promise<void> {
    return apiClient.post<void>("/trabajaEnGrupo", data);
  },

  /**
   * Elimina una asignación de técnico a grupo por ID de asignación.
   */
  async delete(asignacionId: number): Promise<void> {
    return apiClient.delete<void>(`/trabajaEnGrupo/${asignacionId}`);
  },

  /**
   * Elimina una asignación de técnico a grupo por técnico y grupo.
   * Ruta: /trabajaEnGrupo/{tecnicoId}/{grupoId}
   */
  async deleteByTecnicoAndGrupo(tecnicoId: number, grupoId: number): Promise<void> {
    return apiClient.delete<void>(`/trabajaEnGrupo/${tecnicoId}/${grupoId}`);
  },
};