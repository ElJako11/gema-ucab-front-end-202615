import type { Actividad } from "@/types/checklist.types";
import { QUERY_KEYS } from "../consts/queryKeys";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChecklistItem } from "@/services/checklist";

export const useCreateChecklistItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Actividad) => createChecklistItem(data),
        
        onSuccess: () => {
            toast.success("Actividad creada correctamente");
            // Hacer que la lista de actividades se recargue sola
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHECKLIST_ITEMS });
        },
        
        onError: (error: Error) => {
            console.error("Error al crear la actividad:", error);
            toast.error(error.message || "No se pudo crear la actividad");
        }
    });
}