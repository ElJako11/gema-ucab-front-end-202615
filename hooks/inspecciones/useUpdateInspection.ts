import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";

export interface UpdateInspectionRequest {
  "idInspeccion": number;
  "fechaCreacion": string;
  "ubicacion": string;
  "estado": string;
  "areaEncargada": string;
  "supervisor": string;
  "frecuencia": string;
  "titulo": string;
}

export const useUpdateInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateInspectionRequest }) => {
      const response = await apiClient.patch(`/inspecciones/${id}`, data);
      return response;
    },
    onSuccess: () => {
      toast.success("Inspección actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["inspecciones"] });
      queryClient.invalidateQueries({ queryKey: ["calendario"] });
    },
    onError: () => {
      toast.error("Error al actualizar la inspección");
    },
  });
};