// src/hooks/grupos-trabajo/useTrabajadoresPorGrupo.ts
import { useQuery } from "@tanstack/react-query";
import { getAllWorkersInALLGroups } from "@/services/gruposDeTrabajo";

export const useTrabajadoresPorGrupo = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["trabajadoresPorGrupo"],
    queryFn: getAllWorkersInALLGroups,
    select: (data) => {
      // Mapear la respuesta a un objeto { grupoId: usuarios[] }
      const map: Record<number, any[]> = {};
      data.data.forEach((item) => {
        map[item.grupoDeTrabajoId] = item.usuarios;
      });
      return map;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  return {
    trabajadoresPorGrupo: data,
    isLoading,
    error,
    refetch,
  };
};