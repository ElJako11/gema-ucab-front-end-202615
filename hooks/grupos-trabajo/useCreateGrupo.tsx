import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { gruposAPI } from "@/lib/api/grupos";

export const useCreateGrupo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: gruposAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      queryClient.invalidateQueries({ queryKey: ["trabajadoresPorGrupo"] });
      toast.success("Grupo de trabajo creado correctamente");
    },
    onError: (error: any) => {
      console.error("Error al crear grupo:", error);
      toast.error("Error al crear el grupo de trabajo");
    },
  });
};