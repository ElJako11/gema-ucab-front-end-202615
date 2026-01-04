import type { Actividad } from "@/types/checklist.types";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChecklistItem } from "@/lib/api/checklist";

type CreateParams = {
    checklistId: number;
    data: Actividad;
};

export const useCreateChecklistItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ checklistId, data }: CreateParams) => 
            createChecklistItem(checklistId, data),

        onSuccess: async () => {
            toast.success("Actividad creada exitosamente");
            // Usamos await para asegurar que se dispare la recarga
            await queryClient.invalidateQueries({ 
                queryKey: ["checklistItems"],
                refetchType: 'active' // Fuerza la recarga inmediata de las consultas activas en pantalla
            });
        },
        onError: (error) => {
            console.error("Error al crear:", error);
            toast.error("Error al crear la actividad");
        }
    });
}