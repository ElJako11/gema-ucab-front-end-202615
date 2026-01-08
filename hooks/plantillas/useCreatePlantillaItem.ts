import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlantillaItem } from "@/lib/api/plantillas";
import { toast } from "sonner";
import { Actividad } from "@/types/checklist.types";

type CreateParams = {
    plantillaId: number;
    data: Actividad;
};

export const useCreatePlantillaItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ plantillaId, data }: CreateParams) =>
            createPlantillaItem(plantillaId, { nombre: data.nombre, descripcion: data.descripcion, estado: data.estado }),

        onSuccess: async (_, variables) => {
            toast.success("Actividad de plantilla creada exitosamente");
            // Invalidar la query específica de esta plantilla con su ID
            await queryClient.invalidateQueries({
                queryKey: ["plantilla", variables.plantillaId],
            });
            // También invalidar la lista general de plantillas
            await queryClient.invalidateQueries({
                queryKey: ["plantillas"],
            });
        },
        onError: (error) => {
            console.error("Error al crear item de plantilla:", error);
            toast.error("Error al crear la actividad de la plantilla");
        }
    });
}
