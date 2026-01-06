import { useQuery } from "@tanstack/react-query";
import { InspeccionAPI } from "@/lib/api/inspecciones";

export const useInspeccionDetalle = (id:number) => {
    return useQuery({
        queryKey: ["Inspeccion","detalle",id],
        queryFn: () => InspeccionAPI.getDetalle(id),
        enabled: !!id,
        select: (data) => {
            return data;
        },
    })
}