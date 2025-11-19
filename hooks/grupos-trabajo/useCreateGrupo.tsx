// src/hooks/grupos-trabajo/useCreateGrupo.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createGrupoDeTrabajo } from "@/services/gruposTrabajo";

export const useCreateGrupo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createGrupoDeTrabajo,
    onSuccess: () => {
      toast.success("Grupo creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["gruposTrabajo"] });
      queryClient.invalidateQueries({ queryKey: ["trabajadoresPorGrupo"] });
    },
    onError: (error: Error) => {
      console.error("Error al crear el grupo:", error);
      toast.error(error.message || "Error al crear el grupo");
    },
  });
};