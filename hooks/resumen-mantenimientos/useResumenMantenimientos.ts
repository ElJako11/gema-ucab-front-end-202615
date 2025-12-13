import { useQuery } from "@tanstack/react-query";

import { getResumenMantenimientos } from "@/services/resumenMantenimientos";
import { QUERY_KEYS } from "../consts/queryKeys";

type UseResumenMantenimientosParams = {
  date?: string;
  filter?: "mensual" | "semanal";
};

export const useResumenMantenimientos = (
  params: UseResumenMantenimientosParams
) => {
  const { date, filter = "semanal" } = params;

  const query = useQuery({
    queryKey: [...QUERY_KEYS.RESUMEN_MANTENIMIENTOS, { date, filter }],
    queryFn: () => getResumenMantenimientos({ date, filter }),
    enabled: Boolean(date && filter),
    staleTime: 5 * 60 * 1000,
    select: (data) => data ?? [],
  });

  const resumenes = query.data ?? [];

  return {
    ...query,
    resumenes,
    isEmpty: !query.isLoading && resumenes.length === 0,
  };
};
