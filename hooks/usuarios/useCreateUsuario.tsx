import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { crearUsuario } from "@/services/usuarios";

export const useCreateUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: crearUsuario,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
            toast.success("Usuario creado correctamente");
        },
        onError: (error: any) => {
            console.error("Error al crear usuario:", error);
            toast.error("Error al crear el usuario");
        },
    });
};
