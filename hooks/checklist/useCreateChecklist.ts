import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChecklist } from "@/lib/api/checklist";

type CreateParams = {
    idInspeccion: number;
    idMantenimiento: number;
    nombre: string;
};

export const useCreateChecklist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateParams) =>
            createChecklist(
                params.nombre,
                params.idInspeccion.toString(),
                params.idMantenimiento.toString(),
            ),
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