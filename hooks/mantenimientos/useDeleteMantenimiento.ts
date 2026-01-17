import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mantenimientosAPI } from "@/lib/api/mantenimientos";

export const useDeleteMantenimiento = (id: number) => {

    const queryClient = useQueryClient();

    return useMutation({
        //Llamamos al api 
        mutationFn: (id: number) => mantenimientosAPI.delete(id),

        //En caso de ser existosa 
        onSuccess: async (_data, variables) => {
            // Evitamos que intente volver a buscar el mantenimiento eliminado
            await queryClient.cancelQueries({ queryKey: ["mantenimiento", "detalle", variables] });
            queryClient.setQueryData(["mantenimiento", "detalle", variables], null);

            // También limpiamos el checklist asociado para evitar errores 404
            await queryClient.cancelQueries({ queryKey: ["checklistItems", "mantenimientos", variables] });
            queryClient.setQueryData(["checklistItems", "mantenimientos", variables], null);

            //invalidamos las consulta relacionadas para que la lista se refresque 
            queryClient.invalidateQueries({ queryKey: ["mantenimientos"] });
            queryClient.invalidateQueries({ queryKey: ["calendario"] });
        },

        onError: (error) => {
            console.error("Error eliminando mantenimiento", error);
        }
    })


}