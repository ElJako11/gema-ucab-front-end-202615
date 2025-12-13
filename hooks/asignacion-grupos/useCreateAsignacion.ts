import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { asignacionGruposAPI } from "@/lib/api/asignacion-grupos";

export const useCreateAsignacion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: asignacionGruposAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asignaciones"] });
      queryClient.invalidateQueries({ queryKey: ["trabajadoresPorGrupo"] });
      toast.success("Técnico asignado al grupo correctamente");
    },
    onError: (error: any) => {
      console.error("Error al asignar técnico:", error);
      toast.error("Error al asignar técnico al grupo");
    },
  });
};