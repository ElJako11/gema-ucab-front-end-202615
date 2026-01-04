import type { Actividad } from "@/types/checklist.types";import { QUERY_KEYS } from "../consts/queryKeys";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChecklistItem } from "@/lib/api/checklist";

type UpdateParams = {
    checklistId: number;
    data: Actividad;
};

export const useUpdateChecklistItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ checklistId, data }: UpdateParams) => 
            updateChecklistItem(checklistId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checklistItems"] });
            console.log("Item actualizado correctamente");
        },
        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });
}