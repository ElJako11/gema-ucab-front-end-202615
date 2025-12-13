import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { gruposAPI, type UpdateGrupoRequest } from "@/lib/api/grupos";

interface UpdateGrupoParams {
  id: number;
  data: UpdateGrupoRequest;
}

export const useUpdateGrupo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: UpdateGrupoParams) => gruposAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      queryClient.invalidateQueries({ queryKey: ["grupo"] });
      queryClient.invalidateQueries({ queryKey: ["trabajadoresPorGrupo"] });
      toast.success("Grupo de trabajo actualizado correctamente");
    },
    onError: (error: any) => {
      console.error("Error al actualizar grupo:", error);
      toast.error("Error al actualizar el grupo de trabajo");
    },
  });
};