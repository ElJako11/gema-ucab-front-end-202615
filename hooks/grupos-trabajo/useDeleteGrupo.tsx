import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { gruposAPI } from "@/lib/api/grupos";

export const useDeleteGrupo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => gruposAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      queryClient.invalidateQueries({ queryKey: ["grupo"] });
      queryClient.invalidateQueries({ queryKey: ["trabajadoresPorGrupo"] });
      toast.success("Grupo de trabajo eliminado correctamente");
    },
    onError: (error: any) => {
      console.error("Error al eliminar grupo:", error);
      toast.error("Error al eliminar el grupo de trabajo");
    },
  });
};