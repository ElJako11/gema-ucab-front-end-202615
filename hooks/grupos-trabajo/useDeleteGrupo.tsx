// src/hooks/grupos-trabajo/useDeleteGrupo.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteGrupoDeTrabajo } from "@/services/gruposDeTrabajo";

export const useDeleteGrupo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteGrupoDeTrabajo,
    onSuccess: () => {
      toast.success("Grupo eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["gruposTrabajo"] });
      queryClient.invalidateQueries({ queryKey: ["trabajadoresPorGrupo"] });
    },
    onError: (error: Error) => {
      console.error("Error al eliminar el grupo:", error);
      toast.error(error.message || "Error al eliminar el grupo");
    },
  });
};