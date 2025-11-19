// src/hooks/grupos-trabajo/useEditGrupo.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { editGrupoDeTrabajo } from "@/services/gruposTrabajo";

export const useEditGrupo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: editGrupoDeTrabajo,
    onSuccess: () => {
      toast.success("Grupo editado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["gruposTrabajo"] });
      queryClient.invalidateQueries({ queryKey: ["trabajadoresPorGrupo"] });
    },
    onError: (error: Error) => {
      console.error("Error al editar el grupo:", error);
      toast.error(error.message || "Error al editar el grupo");
    },
  });
};