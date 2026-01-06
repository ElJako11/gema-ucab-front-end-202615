import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";

export interface CreateInspectionRequest {
  tipoTrabajo: "Inspeccion";
  fechaCreacion: string;
  idUbicacionTecnica: number;
  idGrupo: number;
  supervisorId: number;
  prioridad: string;
  fechaLimite: string;
  frecuencia: string;
  especificacion: string;
}

export const useCreateInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInspectionRequest) => {

      
      try {
        const response = await apiClient.post("/work-creation", data);
        console.log("✅ [INSPECCIÓN] Respuesta exitosa del servidor:", response);
        console.log("🔍 [INSPECCIÓN] Verificación de respuesta del servidor:", {
          tieneData: !!response?.data,
          fechaCreacionEnRespuesta: response?.data?.fechaCreacion || response?.fechaCreacion,
          respuestaCompleta: response
        });
        return response;
      } catch (error) {
        console.error("❌ [INSPECCIÓN] Error en la petición:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("🎉 [INSPECCIÓN] Inspección creada exitosamente:", data);
      toast.success("Inspección creada exitosamente");
      
      // Invalidar múltiples queries para refrescar datos
      console.log("🔄 [INSPECCIÓN] Invalidando queries...");
      
      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: ["inspecciones"] });
      queryClient.invalidateQueries({ queryKey: ["trabajos"] });
      queryClient.invalidateQueries({ queryKey: ["work-creation"] });
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
      console.error("💥 [INSPECCIÓN] Error al crear inspección:", error);
      console.error("📋 [INSPECCIÓN] Detalles del error:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText
      });
      toast.error("Error al crear la inspección");
    },
  });
};