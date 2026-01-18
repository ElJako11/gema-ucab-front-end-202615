import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";

export interface CreateInspectionRequest {
  nombre?: string;
  tipoTrabajo: string;
  fechaCreacion: string;
  idUbicacionTecnica: number;
  idGrupo: number;
  prioridad: "BAJA" | "MEDIA" | "ALTA";
  frecuencia: string;
  observacion: string;
  codigoArea?: string;
  codigoVerificacion?: string;
}


export interface EditInspectionRequest {
  idMantenimiento: string;
  idInspeccion: string;
  nombre?: string;
  tipo?: 'Periodico' | 'Condicion';
  fechaLimite?: string;
  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA';
  frecuencia?: 'Diaria' | 'Semanal' | 'Mensual' | 'Trimestral' | 'Anual';
  resumen?: string;
  observacion?: string;
  fechaCreacion?: string;
}

export const useCreateInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInspectionRequest) => {


      try {
        const response = await apiClient.post("/work-creation", data);

        return response;
      } catch (error) {
        console.error("❌ [INSPECCIÓN] Error en la petición:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Inspección creada exitosamente");

      // Invalidar múltiples queries para refrescar datos

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