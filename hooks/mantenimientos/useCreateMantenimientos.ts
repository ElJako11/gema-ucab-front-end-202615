import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { mantenimientosAPI } from "@/lib/api/mantenimientos";

export const useCreateMantenimiento = () => {
    const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: async (data: any) => {
            
            try {
                const response = await mantenimientosAPI.create(data);
                return response;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: (data) => {
            toast.success("Mantenimiento creado correctamente");
            
            // Invalidar múltiples queries para refrescar datos
            
            // Invalidar queries específicas
            queryClient.invalidateQueries({ queryKey: ["mantenimientos"] });
            queryClient.invalidateQueries({ queryKey: ["trabajos"] });
            queryClient.invalidateQueries({ queryKey: ["elementos"] });
            
            // Invalidar todas las queries del calendario (importante para actualización inmediata)
            queryClient.invalidateQueries({ queryKey: ["calendario"] });
            
            // También invalidar queries específicas del calendario por si acaso
            queryClient.invalidateQueries({ 
                predicate: (query) => {
                    return query.queryKey[0] === "calendario" || 
                           query.queryKey.includes("mantenimientos") ||
                           query.queryKey.includes("inspecciones");
                }
            });
            
        },
        onError: (error: any) => {
            console.error("📋 [MANTENIMIENTO] Detalles del error:", {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                statusText: error?.response?.statusText
            });
            toast.error("Error al crear el mantenimiento");
        },
    }); 
}; 
