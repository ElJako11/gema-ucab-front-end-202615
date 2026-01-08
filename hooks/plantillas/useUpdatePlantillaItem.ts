import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePlantillaItem } from "@/lib/api/plantillas";
import { toast } from "sonner";
import { Actividad } from "@/types/checklist.types";

type UpdateParams = {
    plantillaId: number;
    data: Actividad;
};

export const useUpdatePlantillaItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ plantillaId, data }: UpdateParams) =>
            updatePlantillaItem(plantillaId, data.id, { nombre: data.nombre, descripcion: data.descripcion, estado: data.estado }),

        onSuccess: async (_, variables) => {
            toast.success("Actividad de plantilla actualizada");
            await queryClient.invalidateQueries({ queryKey: ["plantilla", variables.plantillaId] });
            await queryClient.invalidateQueries({ queryKey: ["plantillas"] });
        },
        onError: (error) => {
            console.error("Error al actualizar item de plantilla:", error);
            toast.error("Error al actualizar la actividad");
        }
    });
}
