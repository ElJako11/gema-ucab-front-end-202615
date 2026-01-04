import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { mantenimientosAPI } from "@/lib/api/mantenimientos";

export const useCreateMantenimiento = () => {
    const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: async (data: any) => {
            console.log("🔄 [MANTENIMIENTO] Iniciando creación de mantenimiento...");
            console.log("📤 [MANTENIMIENTO] Datos enviados:", JSON.stringify(data, null, 2));
            
            try {
                const response = await mantenimientosAPI.create(data);
                console.log("✅ [MANTENIMIENTO] Respuesta exitosa del servidor:", response);
                return response;
            } catch (error) {
                console.error("❌ [MANTENIMIENTO] Error en la petición:", error);
                throw error;
            }
        },
        onSuccess: (data) => {
            console.log("🎉 [MANTENIMIENTO] Mantenimiento creado exitosamente:", data);
            toast.success("Mantenimiento creado correctamente");
            
            // Invalidar múltiples queries para refrescar datos
            console.log("🔄 [MANTENIMIENTO] Invalidando queries...");
            
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
            
            console.log("✅ [MANTENIMIENTO] Queries invalidadas correctamente");
        },
        onError: (error: any) => {
            console.error("💥 [MANTENIMIENTO] Error al crear mantenimiento:", error);
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
