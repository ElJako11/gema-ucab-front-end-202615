import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InspeccionAPI } from "@/lib/api/inspecciones"

export const useDeleteInsepccion = (id: number) => {

    const queryClient = useQueryClient();

    return useMutation({
        //Llamamos al api 

        mutationFn: (id: number) => InspeccionAPI.delete(id),

        //En caso de ser existoso 

        onSuccess: () => {
            //invalidamos la consulta relacionada 
            queryClient.invalidateQueries({ queryKey: ["inspeccion"] });
            queryClient.invalidateQueries({ queryKey: ["calendario"] });
        },

        onError: (error) => {
            console.error("Error eliminando mantenimiento");
        }
    })
}