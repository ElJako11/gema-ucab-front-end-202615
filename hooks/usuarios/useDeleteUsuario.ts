import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteUsuario } from "@/services/usuarios";

export const useDeleteUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUsuario,
        onSuccess: () => {
            toast.success("Usuario eliminado exitosamente");
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        },
        onError: (error) => {
            toast.error("Error al eliminar usuario");
        },
    });
};