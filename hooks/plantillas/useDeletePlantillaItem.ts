import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePlantillaItem } from "@/lib/api/plantillas";
import { toast } from "sonner";

type DeleteParams = {
    plantillaId: number;
    itemId: number;
};

export const useDeletePlantillaItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ plantillaId, itemId }: DeleteParams) =>
            deletePlantillaItem(plantillaId, itemId),

        onSuccess: async (_, variables) => {
            toast.success("Item eliminado de la plantilla");
            await queryClient.invalidateQueries({ queryKey: ["plantilla", variables.plantillaId] });
            await queryClient.invalidateQueries({ queryKey: ["plantillas"] });
        },
        onError: (error) => {
            console.error("Error al eliminar item de plantilla:", error);
            toast.error("Error al eliminar el item");
        }
    });
}
