import apiClient from "./client";
import type { Tecnico } from "@/types/tecnicos.types"

export interface CreateTecnicoRequest {
    nombre: string
    correo: string
    idGT: number
}

interface TecnicosResponse {
    data: Tecnico[]
}

export const tecnicosAPI = {
    async getAll(): Promise<TecnicosResponse> {
        // Ajuste de endpoint: muchos backends exponen la lista en /tecnicos
        return apiClient.get<TecnicosResponse>('/tecnicos/lista')
    },

    async create(data: CreateTecnicoRequest): Promise<Tecnico> {
        return apiClient.post<Tecnico>('/tecnicos', data)
    },

    async delete(id: number): Promise<Tecnico> {
        return apiClient.delete<any>(`/tecnicos/${id}`)
    },

    async update(data: Tecnico): Promise<Tecnico> {
        return apiClient.patch<any>(`/tecnicos/${data.idTecnico}`, data)
    }
}