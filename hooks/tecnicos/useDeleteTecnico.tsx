import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tecnicosAPI } from "@/lib/api/tecnicos";
import { toast } from "sonner";

export const useDeleteTecnico = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => tecnicosAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tecnicos']
            })
            queryClient.invalidateQueries({
                queryKey: ['trabajadoresPorGrupo']
            })
            toast.success("Tecnico eliminado exitosamente!");
        },
        onError: () => {
            toast.error("Error al eliminar el tecnico");
        }
    })
}