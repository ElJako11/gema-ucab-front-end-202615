import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";
import { EditInspectionRequest } from "./useCreateInspection";

export const useUpdateInspection = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditInspectionRequest) => {
      const response = await apiClient.patch(`/work-creation`, data);
      return response;
    },
    onSuccess: () => {
      toast.success("Inspección actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["Inspeccion", "detalle", id] });
      queryClient.invalidateQueries({ queryKey: ["inspecciones"] });
      queryClient.invalidateQueries({ queryKey: ["trabajos"] });
      queryClient.invalidateQueries({ queryKey: ["calendario"] });
    },
    onError: () => {
      toast.error("Error al actualizar la inspección");
    },
  });
};