import { useQuery } from "@tanstack/react-query";
import { ubicacionesTecnicasAPI } from "@/lib/api/ubicacionesTecnicas";

export const useUbicaciones = () => {
    return useQuery({
        queryKey: ["ubicacionesTecnicas"],
        queryFn: ubicacionesTecnicasAPI.getAll,
        select: (data) => data.data,
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
