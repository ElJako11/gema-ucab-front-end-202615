import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChecklist} from "@/lib/api/checklist";

export const useCreateChecklist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (nombre: string) => 
            createChecklist(nombre),    
        onSuccess: async () => {
            // Usamos await para asegurar que se dispare la recarga
            await queryClient.invalidateQueries({ 
                queryKey: ["checklists"],
                refetchType: 'active' // Fuerza la recarga inmediata de las consultas activas en pantalla
            });
        },
        onError: (error) => {
            console.error("Error al crear checklist:", error);
        }
    });
}