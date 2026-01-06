import { useQuery } from "@tanstack/react-query";
import { mantenimientosAPI } from "@/lib/api/mantenimientos";

export const useMantenimientoDetalle = (id: number) => {
    return useQuery({
        queryKey: ["mantenimiento", "detalle", id],
        queryFn: () => mantenimientosAPI.getDetalle(id),
        enabled: !!id,
        select: (data) => {
            return data;
        },
    });
};
