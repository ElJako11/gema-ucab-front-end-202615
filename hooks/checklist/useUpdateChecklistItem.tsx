import type { Actividad } from "@/types/checklist.types";
import { QUERY_KEYS } from "../consts/queryKeys";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChecklistItem } from "@/services/checklist";

export const useUpdateChecklistItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Actividad) => updateChecklistItem(data),
        
        onSuccess: () => {
            toast.success("Actividad actualizada correctamente");
            // Hacer que la lista de actividades se recargue sola
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHECKLIST_ITEMS });
        },
        
        onError: (error: Error) => {
            console.error("Error al actualizar la actividad:", error);
            toast.error(error.message || "No se pudo actualizar la actividad");
        }
    });
}