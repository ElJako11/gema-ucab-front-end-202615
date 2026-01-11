import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { mantenimientosAPI,CreateMantenimientoRequest } from "@/lib/api/mantenimientos";

export const useCreateMantenimiento = () => {
    const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: (data: CreateMantenimientoRequest) => mantenimientosAPI.create(data),
        onSuccess: (data) => {
            toast.success("Mantenimiento creado correctamente");
            
            // Invalidar todas las queries del calendario (importante para actualización inmediata)
            queryClient.invalidateQueries({ queryKey: ["calendario"] });
            
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
