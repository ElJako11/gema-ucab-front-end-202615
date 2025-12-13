import { useQuery } from "@tanstack/react-query";

import { getResumenMantenimiento } from "@/services/resumenMantenimientos";
import { QUERY_KEYS } from "../consts/queryKeys";

type UseResumenMantenimientoOptions = {
  enabled?: boolean;
};

export const useResumenMantenimiento = (
  id: number | string,
  options?: UseResumenMantenimientoOptions
) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.RESUMEN_MANTENIMIENTO(id),
    queryFn: () => getResumenMantenimiento(id),
    enabled: options?.enabled ?? true,
    select: (data) => data ?? null,
  });

  const resumen = query.data ?? null;

  return {
    ...query,
    resumen,
    isEmpty: !query.isLoading && resumen === null,
  };
};
