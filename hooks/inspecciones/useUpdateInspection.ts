import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";
import { EditInspectionRequest } from "./useCreateInspection";

export const useUpdateInspection = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditInspectionRequest) => {
      const response = await apiClient.patch(`/inspecciones/${id}`, data);
      return response;
    },
    onSuccess: () => {
      toast.success("Inspección actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["Inspeccion", "detalle", id] });
    },
    onError: () => {
      toast.error("Error al actualizar la inspección");
    },
  });
};