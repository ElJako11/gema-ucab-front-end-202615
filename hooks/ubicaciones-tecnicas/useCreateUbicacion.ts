import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ubicacionesAPI } from "@/lib/api/ubicacionesTecnicas";

export const useCreateUbicacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ubicacionesAPI.createUbicacionTecnica,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ubicaciones"] });
        },
    });
};
