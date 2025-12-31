import { useQuery } from "@tanstack/react-query";
import { getResumen } from "@/lib/api/resumen";

export const useGetResumen = (date: string, filter: "mensual" | "semanal") => {
    return useQuery({
        queryKey: ['resumen', date, filter],
        queryFn: () => getResumen(date, filter)
    });
}