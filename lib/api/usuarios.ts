import apiClient from "./client";
import type { Usuario } from "@/types/usuarios.types";

interface CreateUsuarioRequest {
    Nombre: string;
    Correo: string;
    Tipo: "DIRECTOR" | "COORDINADOR" | "SUPERVISOR";
    Contraseña: string;
}

export const userAPI = {
    async getAll(): Promise<Usuario[]> {
        return apiClient.get<Usuario[]>('/usuarios'); 
    },

    async create(data: CreateUsuarioRequest): Promise<Usuario> {
        return apiClient.post<Usuario>('/usuarios', data);
    }
}