import { useQuery } from "@tanstack/react-query";
import { asignacionGruposAPI } from "@/lib/api/asignacion-grupos";

// Hook para obtener todas las asignaciones de grupos
export const useAsignaciones = () => {
  return useQuery({
    queryKey: ["asignaciones"],
    queryFn: asignacionGruposAPI.getAll,
    select: (data) => data.data,
  });
};

// Hook para obtener asignaciones de un grupo específico
export const useAsignacionesPorGrupo = (grupoId: number) => {
  return useQuery({
    queryKey: ["asignaciones", grupoId],
    queryFn: () => asignacionGruposAPI.getByGrupoId(grupoId),
    select: (data) => data.data,
    enabled: !!grupoId,
  });
};