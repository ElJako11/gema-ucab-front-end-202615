import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ubicacionesTecnicasAPI, type UpdateUbicacionTecnicaRequest } from "@/lib/api/ubicacionesTecnicas";
import { toast } from "sonner";

interface UpdateUbicacionParams {
    id: number;
    data: UpdateUbicacionTecnicaRequest;
}

export const useUpdateUbicacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateUbicacionParams) => 
            ubicacionesTecnicasAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ubicacionesTecnicas"] });
            queryClient.invalidateQueries({ queryKey: ["padresUbicacion"] });
            queryClient.invalidateQueries({ queryKey: ["dependientesUbicacion"] });
            toast.success("Ubicación técnica actualizada correctamente");
        },
        onError: (error: any) => {
            console.error("Error al actualizar ubicación:", error);
            toast.error("Error al actualizar ubicación técnica");
        },
    });
};