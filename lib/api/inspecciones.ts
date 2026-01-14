import { ResumenInspeccion } from "@/types/resumenInspeccion.types";
import apiClient from "./client";

interface inspeccionRequest {
    data: ResumenInspeccion[]
}

export const InspeccionAPI = {
    async getDetalle(id: number): Promise<any> {
        return apiClient.get<any>(`/inspecciones/${id}`);
    },

    async delete(id: number): Promise<any> {
        return apiClient.delete<any>(`/inspecciones/${id}`);
    },

    async getResumen(id: number): Promise<ResumenInspeccion> {
        return apiClient.get<ResumenInspeccion>(`/inspecciones/resumen/${id}`)
    }
}