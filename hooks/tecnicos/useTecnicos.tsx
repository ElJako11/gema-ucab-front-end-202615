import { useQuery } from "@tanstack/react-query";
import { tecnicosAPI } from "@/lib/api/tecnicos";

export const useTecnicos = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tecnicos"],
    queryFn: tecnicosAPI.getAll,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (cache)
  });

  return {
    tecnicos: data ?? [],
    isLoading,
    error,
    refetch,
  };
};