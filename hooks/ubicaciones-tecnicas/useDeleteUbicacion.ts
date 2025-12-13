import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ubicacionesTecnicasAPI } from "@/lib/api/ubicacionesTecnicas";
import { toast } from "sonner";

export const useDeleteUbicacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => ubicacionesTecnicasAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ubicacionesTecnicas"] });
            queryClient.invalidateQueries({ queryKey: ["padresUbicacion"] });
            queryClient.invalidateQueries({ queryKey: ["dependientesUbicacion"] });
            queryClient.invalidateQueries({ queryKey: ["ubicacionesNivel"] });
            toast.success("Ubicación técnica eliminada correctamente");
        },
        onError: (error: any) => {
            console.error("Error al eliminar ubicación:", error);
            toast.error("Error al eliminar ubicación técnica");
        },
    });
};