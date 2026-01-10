import apiClient from "./client";
import type { Mantenimiento } from "@/types/mantenimientos.types";

export interface CreateMantenimientoRequest {
    tipoTrabajo: "Mantenimiento";
    titulo: string; 
    prioridad: "Alta" | "Media" | "Baja";
    fechaCreacion: string;
    fechaLimite: string;
    tipoMantenimiento: "Periodico" | "Condicion";
    frecuencia?: "Diaria" | "Semanal" | "Mensual" | "Trimestral" | "Semestral" | "Anual";
    idUbicacionTecnica: number;
    idGrupo: number;
    especificacion: string;
}

interface MantenimientosResponse {
    data: Mantenimiento[];
}

export const mantenimientosAPI = {
    async getAll(): Promise<MantenimientosResponse> {
        return apiClient.get<MantenimientosResponse>('/mantenimientos');
    },

    async create(data: CreateMantenimientoRequest): Promise<Mantenimiento> {
        return apiClient.post<Mantenimiento>('/work-creation', data);
    },

    async getFiltros(date: string, filter: string): Promise<any> {
        return apiClient.get<any>(`/mantenimientos/filtros?date=${date}&filter=${filter}`);
    },

    async getResumen(id: number): Promise<any> {
        return apiClient.get<any>(`/mantenimientos/${id}/resumen`);
    },

    async getDetalle(id: number): Promise<any> {
        return apiClient.get<any>(`/mantenimientos/${id}`);
    },

    async delete(id: number): Promise<any> {
        return apiClient.delete<any>(`/mantenimientos/${id}`)
    }
}