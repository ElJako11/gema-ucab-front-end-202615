import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mantenimientosAPI } from "@/lib/api/mantenimientos";
import { toast } from "sonner";

export const useUpdateMantenimiento = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            mantenimientosAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mantenimientos"] });
            queryClient.invalidateQueries({ queryKey: ["mantenimiento"] });
        },
        onError: (error: any) => {
            console.error("Error updating maintenance:", error);
            toast.error("Error al actualizar el mantenimiento");
        }
    });
};
