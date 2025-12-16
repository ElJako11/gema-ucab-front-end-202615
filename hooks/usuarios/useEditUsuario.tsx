import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { editUsuario } from "@/services/usuarios";

export const useEditUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: editUsuario,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
            toast.success("Usuario actualizado correctamente");
        },
        onError: (error: any) => {
            console.error("Error al actualizar usuario:", error);
            toast.error("Error al actualizar el usuario");
        },
    });
};
