import apiClient from "./client";
import type { Inspeccion } from "@/types/inspecciones.types";

interface inspeccionRequest {
    data: Inspeccion[]
}

export const InspeccionAPI = {
    async getDetalle(id: number): Promise<any> {
        return apiClient.get<Inspeccion>(`/inspecciones/${id}`);
    },

    async delete(id: number): Promise<any> {
        return apiClient.delete<any>(`/inspecciones/${id}`);
    }
}