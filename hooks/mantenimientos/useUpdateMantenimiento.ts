import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";
import resumen from "@/app/(dashboard)/resumen/page";

export interface UpdateMantenimientoRequest {
  fechaLimite: string;
  prioridad: string;
  resumen: string;
  tipo: string;
  frecuencia: string;
  instancia: string;
  condicion: string;

}

export const useUpdateMantenimiento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateMantenimientoRequest }) => {
      try {
        const response = await apiClient.patch(`/mantenimientos/${id}`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Mantenimiento actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["mantenimientos"] });
      queryClient.invalidateQueries({ queryKey: ["calendario"] });
    },
    onError: () => {
      toast.error("Error al actualizar el mantenimiento");
    },
  });
};