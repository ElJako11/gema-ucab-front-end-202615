import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChecklistStatus } from "@/lib/api/checklist";
import { toast } from "sonner";

type StatusParams = {
    trabajoId: number;
    checklistId: number;
    itemId: number;
};

export const useUpdateStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ trabajoId,checklistId, itemId}: StatusParams) => 
            updateChecklistStatus(trabajoId ,checklistId, itemId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checklistItems"] });
        },
        onError: (error) => {
            console.error("Error al actualizar estado:", error);
            toast.error("No se pudo guardar el estado en el servidor");
            
            queryClient.invalidateQueries({ queryKey: ["checklistItems"] });
        }
    });
}