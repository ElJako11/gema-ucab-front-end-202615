import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChecklistItem } from "@/lib/api/checklist";

type DeleteParams = {
    checklistId: number;
    itemId: number;
};

export const useEliminarChecklistItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ checklistId, itemId }: DeleteParams) => 
            deleteChecklistItem(checklistId, itemId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checklistItems"] });
            console.log("Elemento eliminado correctamente");
        },
        onError: (error) => {
            console.error("Error al eliminar:", error);
        }
    });
}