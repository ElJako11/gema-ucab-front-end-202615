import { useQuery } from "@tanstack/react-query";
import { mantenimientosAPI } from "@/lib/api/mantenimientos";

export const useResumenMantenimiento = (id: number) => {
  return useQuery({
    queryKey: ["mantenimiento", "resumen", id],
    queryFn: () => mantenimientosAPI.getResumen(id),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
