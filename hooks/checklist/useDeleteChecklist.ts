import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChecklist } from "@/lib/api/checklist";
import { toast } from "sonner";

export const useDeleteChecklist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteChecklist(id),
        onSuccess: () => {
            toast.success("Checklist eliminado correctamente");
            queryClient.invalidateQueries({ queryKey: ["checklist"] });
            queryClient.invalidateQueries({ queryKey: ["mantenimiento"] });
            queryClient.invalidateQueries({ queryKey: ["mantenimientos"] });
            queryClient.invalidateQueries({ queryKey: ["Inspeccion"] });
        },
        onError: (error: any) => {
            toast.error("Error al eliminar el checklist");
            console.error(error);
        },
    });
};
