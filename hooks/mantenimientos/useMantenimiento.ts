import { useQuery } from "@tanstack/react-query";
import { mantenimientosAPI } from "@/lib/api/mantenimientos";

export const useMantenimientoDetalle = (id: number, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["mantenimiento", "detalle", id],
        queryFn: () => mantenimientosAPI.getDetalle(id),
        enabled: options?.enabled !== undefined ? options.enabled : !!id,
        select: (data) => {
            return data;
        },
        retry: false,
        refetchOnWindowFocus: false,
    });
};
