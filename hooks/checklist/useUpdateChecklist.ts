import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChecklist } from "@/lib/api/checklist";
import { toast } from "sonner";

export const useUpdateChecklist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, nombre }: { id: number; nombre: string }) =>
            updateChecklist(id, nombre),
        onSuccess: () => {
            toast.success("Checklist actualizado correctamente");
            queryClient.invalidateQueries({ queryKey: ["checklist"] });
            queryClient.invalidateQueries({ queryKey: ["mantenimiento"] });
            queryClient.invalidateQueries({ queryKey: ["Inspeccion"] });
        },
        onError: (error: any) => {
            toast.error("Error al actualizar el checklist");
            console.error(error);
        },
    });
};
