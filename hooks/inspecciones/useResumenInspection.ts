import { useQuery } from "@tanstack/react-query";
import { InspeccionAPI } from "@/lib/api/inspecciones";

export const useResumenInspection = (id: number) => {
    return useQuery({
        queryKey: ["Inspeccion", id],
        queryFn: () => InspeccionAPI.getResumen(id),
        enabled: !!id,
        select: (data) => data,
    })
}