import apiClient from "./client";
import type { Tecnico } from "@/types/tecnicos.types"

interface CreateTecnicoRequest {
    Nombre: string
    Correo: string
}

interface TecnicosResponse {
    data: Tecnico[]
}

export const tecnicosAPI = {
    async getAll(): Promise<TecnicosResponse> {
        return apiClient.get<TecnicosResponse>('/tecnicos')
    },

    async create(data: CreateTecnicoRequest): Promise<Tecnico> {
        return apiClient.post<Tecnico>('/tecnicos', data)
    }
}