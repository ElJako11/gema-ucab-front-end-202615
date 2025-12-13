import { useQuery } from "@tanstack/react-query";
import { gruposAPI } from "@/lib/api/grupos";

// Hook principal para obtener todos los grupos de trabajo
export const useGrupos = () => {
  return useQuery({
    queryKey: ["grupos"],
    queryFn: gruposAPI.getAll,
    select: (data) => data.data,
  });
};

// Hook para obtener un grupo específico por ID
export const useGrupo = (id: number) => {
  return useQuery({
    queryKey: ["grupo", id],
    queryFn: () => gruposAPI.getById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};