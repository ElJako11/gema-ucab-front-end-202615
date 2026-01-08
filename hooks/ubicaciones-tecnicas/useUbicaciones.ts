import { useQuery } from "@tanstack/react-query";
import { ubicacionesTecnicasAPI } from "@/lib/api/ubicacionesTecnicas";

export const useUbicaciones = () => {
    return useQuery({
        queryKey: ["ubicacionesTecnicas"],
        queryFn: async () => {
            try {
                const result = await ubicacionesTecnicasAPI.getAll();
                return result;
            } catch (error) {
                console.error("❌ Error al obtener ubicaciones:", error);
                throw error;
            }
        },
        select: (data) => {
            return data.data;
        },
    });
};

export const useUbicacionPadres = (idUbicacion?: number) => {
    return useQuery({
        queryKey: ["padresUbicacion", idUbicacion],
        queryFn: () => 
            idUbicacion 
                ? ubicacionesTecnicasAPI.getPadres(idUbicacion)
                : Promise.resolve({ data: [] }),
        enabled: !!idUbicacion,
    });
};

export const useUbicacionDependientes = (idUbicacion?: number) => {
    return useQuery({
        queryKey: ["ubicacionesDependientes", idUbicacion],
        queryFn: () => ubicacionesTecnicasAPI.getDependientes(idUbicacion || 0),
        enabled: !!idUbicacion,
    });
};

// Hook para obtener ubicaciones por nivel
export const useUbicacionesPorNivel = (nivel: number) => {
    return useQuery({
        queryKey: ["ubicacionesNivel", nivel],
        queryFn: () => ubicacionesTecnicasAPI.getByNivel(nivel),
        enabled: nivel > 0,
    });
};

// Hook para obtener lista plana de ubicaciones técnicas
export const useUbicacionesLista = () => {
    return useQuery({
        queryKey: ["ubicacionesLista"],
        queryFn: ubicacionesTecnicasAPI.getLista,
        select: (data) => data.data,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
    });
};
