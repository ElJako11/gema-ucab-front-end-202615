import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteUsuario } from "@/services/usuarios";

export const useDeleteUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUsuario,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
            toast.success("Usuario eliminado correctamente");
        },
        onError: (error: any) => {
            console.error("Error al eliminar usuario:", error);
            toast.error("Error al eliminar el usuario");
        },
    });
};
