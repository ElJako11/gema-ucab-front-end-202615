import { useQuery } from "@tanstack/react-query";
import { userAPI } from "@/lib/api/usuarios";

export const useUsuarios = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["usuarios"], // 🔑 Clave única para el cache
        queryFn: userAPI.getAll,
        select: (data) => data, // La API ya devuelve el array directamente
        staleTime: 5 * 60 * 1000, // 5 minutos - datos "frescos"
        gcTime: 10 * 60 * 1000, // 10 minutos - tiempo en cache
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
        queryKey: ["usuarios", "coordinadores"], // 🔑 Clave específica
        queryFn: userAPI.getAll,
        select: (data) => {
            // Filtrar solo coordinadores - data ya es el array
            return data.filter(usuario => usuario.Tipo === "COORDINADOR");
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
        queryKey: ["usuarios", "supervisores"], // 🔑 Clave específica
        queryFn: userAPI.getAll,
        select: (data) => {
            // Debug: Ver la respuesta y tipos
         
            // Filtrar solo supervisores - data ya es el array
            const supervisores = data.filter(usuario => usuario.Tipo === "SUPERVISOR");
          
            
            return supervisores;
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