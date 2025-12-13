import { useQuery } from "@tanstack/react-query";
import { asignacionGruposAPI } from "@/lib/api/asignacion-grupos";
import type { Usuario } from "@/types/usuarios.types";

export const useTrabajadoresPorGrupo = () => {
  return useQuery({
    queryKey: ["trabajadoresPorGrupo"],
    queryFn: asignacionGruposAPI.getAll,
    select: (data) => {
      // Mapear la respuesta a un objeto { grupoId: usuarios[] }
      const map: Record<number, Usuario[]> = {};
      data.data.forEach((item) => {
        map[item.grupoDeTrabajoId] = item.usuarios;
      });
      return map;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};