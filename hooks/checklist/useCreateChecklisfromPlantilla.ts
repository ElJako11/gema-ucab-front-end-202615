import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChecklistfromPlantilla } from "@/lib/api/checklist";

type CreateParams = {
    idInspeccion: number;
    idMantenimiento: number;
    idPlantilla: string;
};

export const useCreateChecklisfromPlantilla = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateParams) =>
            createChecklistfromPlantilla(
                params.idInspeccion.toString(),
                params.idMantenimiento.toString(),
                params.idPlantilla
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