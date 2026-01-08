import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tecnicosAPI } from "@/lib/api/tecnicos";
import { Tecnico } from "@/types/tecnicos.types";
import { toast } from "sonner";

export const useEditTecnico = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tecnico: Tecnico) => tecnicosAPI.update(tecnico),
        onSuccess: () => {
            toast.success("Tecnico editado exitosamente");
            queryClient.invalidateQueries({ queryKey: ["tecnicos"] });
        },
        onError: (error) => {
            console.log("Error al editar un tecnico", error)
        }
    })
}