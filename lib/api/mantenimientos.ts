import apiClient from "./client";
import type { Mantenimiento } from "@/types/mantenimientos.types";

interface CreateMantenimientoRequest {
    tipoTrabajo: "Mantenimiento";
    fechaCreacion: string;
    idUbicacionTecnica: number;
    idGrupo: number;
    prioridad: "Alta" | "Media" | "Baja";
    fechaLimite: string;
    frecuencia: "Diaria" | "Semanal" | "Mensual" | "Bimestral" | "Trimestral" | "Semestral" | "Anual";
    tipoMantenimiento: "Periodico" | "Condicion";
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
    }
}