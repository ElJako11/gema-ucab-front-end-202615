import { useQuery } from "@tanstack/react-query";
import { ubicacionesTecnicasAPI } from "@/lib/api/ubicacionesTecnicas";

export const useUbicaciones = () => {
    return useQuery({
        queryKey: ["ubicacionesTecnicas"],
        queryFn: async () => {
            console.log("🔄 Llamando a ubicacionesTecnicasAPI.getAll()");
            try {
                const result = await ubicacionesTecnicasAPI.getAll();
                console.log("✅ Respuesta exitosa de ubicaciones:", result);
                return result;
            } catch (error) {
                console.error("❌ Error al obtener ubicaciones:", error);
                throw error;
            }
        },
        select: (data) => {
            console.log("🔍 Procesando data en select:", data);
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
