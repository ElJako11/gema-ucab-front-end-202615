import { useQuery } from "@tanstack/react-query";

import { getMantenimientosConInspeccion } from "@/services/mantenimientosConInspeccion";
import { QUERY_KEYS } from "../consts/queryKeys";

/**
 * Hook para consultar mantenimientos que tienen una inspección asociada
 * 
 * NOTA: El endpoint del backend no está desarrollado.
 * Actualmente retorna datos mock. Ver services/mantenimientosConInspeccion.ts
 * 
 * Endpoint esperado: GET /mantenimientos-inspeccion
 * 
 * @example
 * const { mantenimientos, isLoading, isError } = useMantenimientosConInspeccion();
 */
export const useMantenimientosConInspeccion = () => {
    const query = useQuery({
        queryKey: QUERY_KEYS.MANTENIMIENTOS_INSPECCION,
        queryFn: getMantenimientosConInspeccion,
        staleTime: 5 * 60 * 1000, // 5 minutos
        select: (data) => data ?? [],
    });

    const mantenimientos = query.data ?? [];

    return {
        ...query,
        mantenimientos,
        isEmpty: !query.isLoading && mantenimientos.length === 0,
    };
};
