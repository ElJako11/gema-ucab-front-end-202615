import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ubicacionesTecnicasAPI } from "@/lib/api/ubicacionesTecnicas";
import { toast } from "sonner";

export const useCreateUbicacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ubicacionesTecnicasAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ubicacionesTecnicas"] });
            toast.success("Ubicación técnica creada correctamente");
        },
        onError: (error: any) => {
            console.error("Error al crear ubicación:", error);
            toast.error("Error al crear ubicación técnica");
        },
    });
};
