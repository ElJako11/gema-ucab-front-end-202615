import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { crearUsuario, UsuarioResponse } from "@/services/usuarios";

export const useCreateUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user: UsuarioResponse) => crearUsuario(user),
        onSuccess: () => {
            toast.success("Usuario creado exitosamente");
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        },
        onError: (error) => {
            const message = error instanceof Error && error.message ? error.message : "Error al crear usuario";
            toast.error(message);
        },
    });
};