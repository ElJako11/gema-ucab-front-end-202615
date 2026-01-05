import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUsuario, crearUsuario, editUsuario, deleteUsuario, fetchUsuarios } from "@/services/usuarios";

export const getUsuarios = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: crearUsuario,
        onSuccess: () => {
            toast.success("Usuario creado exitosamente");
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        },
        onError: (error) => {
            toast.error("Error al crear usuario");
        },
    });
};

