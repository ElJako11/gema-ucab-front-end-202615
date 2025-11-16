// src/hooks/grupos-trabajo/useTecnicos.ts
import { useQuery } from "@tanstack/react-query";
import { getTecnicos } from "@/services/tecnicos";

export const useTecnicos = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tecnicos"],
    queryFn: getTecnicos,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (cache)
  });

  return {
    tecnicos: data,
    isLoading,
    error,
    refetch,
  };
};