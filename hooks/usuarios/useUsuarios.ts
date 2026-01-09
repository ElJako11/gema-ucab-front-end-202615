import { useQuery } from "@tanstack/react-query";
import { userAPI } from "@/lib/api/usuarios";
import type { Usuario } from "@/types/usuarios.types";

// Normaliza posibles respuestas del backend (mayúsculas/minúsculas)
const normalizeUsuario = (raw: any): Usuario | null => {
    if (!raw) return null;
    return {
        id: raw.id ?? raw.Id,
        nombre: raw.nombre ?? raw.Nombre,
        correo: raw.correo ?? raw.Correo,
        tipo: raw.tipo ?? raw.Tipo,
        contraseña: raw.contraseña ?? raw.Contraseña,
    } as Usuario;
};

export const useUsuarios = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["usuarios"],
        queryFn: userAPI.getAll,
        select: (raw) => Array.isArray(raw)
            ? raw.map(normalizeUsuario).filter((u): u is Usuario => u !== null)
            : [],
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        usuarios: data,
        isLoading,
        error,
        refetch,
    };
};

// Hook específico para coordinadores
export const useCoordinadores = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["usuarios", "coordinadores"],
        queryFn: userAPI.getAll,
        select: (raw) => {
            const usuarios = Array.isArray(raw)
                ? raw.map(normalizeUsuario).filter((u): u is Usuario => u !== null)
                : [];
            return usuarios.filter((u) => u.tipo === "COORDINADOR");
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        coordinadores: data,
        isLoading,
        error,
        refetch,
    };
};

// Hook específico para supervisores
export const useSupervisores = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["usuarios", "supervisores"],
        queryFn: userAPI.getAll,
        select: (raw) => {
            const usuarios = Array.isArray(raw)
                ? raw.map(normalizeUsuario).filter((u): u is Usuario => u !== null)
                : [];
            return usuarios.filter((u) => u.tipo === "SUPERVISOR");
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        supervisores: data,
        isLoading,
        error,
        refetch,
    };
};