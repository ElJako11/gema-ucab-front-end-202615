import { useQuery } from "@tanstack/react-query";
import { tecnicosAPI } from "@/lib/api/tecnicos";
import type { Tecnico } from "@/types/tecnicos.types";

export const useTrabajadoresPorGrupo = () => {
  return useQuery({
    queryKey: ["trabajadoresPorGrupo"],
    queryFn: tecnicosAPI.getAll,
    select: (resp) => {
      const tecnicos = (resp?.data ?? []) as Tecnico[];
      const map: Record<number, Tecnico[]> = {};
      for (const tec of tecnicos) {
        const grupoId = tec.idGT ?? tec.idGrupo ?? 0;
        if (!grupoId) continue;
        if (!map[grupoId]) map[grupoId] = [];
        map[grupoId].push(tec);
      }
      return map;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};