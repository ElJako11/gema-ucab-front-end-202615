import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTecnicoRequest, tecnicosAPI } from "@/lib/api/tecnicos";
import { toast } from "sonner";

export const useCreateTecnico = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateTecnicoRequest) => tecnicosAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tecnicos']
            })
            queryClient.invalidateQueries({
                queryKey: ['trabajadoresPorGrupo']
            })
            toast.success("Tecnico creado exitosamente!");
        },
        onError: () => {
            toast.error("Error al crear el tecnico");
        }
    })
}