import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tecnicosAPI } from "@/lib/api/tecnicos";

export const useCreateTecnico = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: tecnicosAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tecnicos']
            })
        }
    })
}