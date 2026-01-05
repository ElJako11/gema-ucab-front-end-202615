import { useQuery } from "@tanstack/react-query";
import { calendarioAPI, type FiltroCalendario } from "@/lib/api/calendario";

/**
 * Hook para obtener eventos del calendario
 * @param date - Fecha en formato YYYY-MM-DD
 * @param filter - Tipo de filtro: "mensual" o "semanal"
 */
export const useCalendario = (date: string, filter: FiltroCalendario) => {
  return useQuery({
    queryKey: ["calendario", date, filter],
    queryFn: () => calendarioAPI.getEventos(date, filter),
    select: (data) => data,
    enabled: !!date && !!filter,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para obtener eventos mensuales del calendario
 * @param date - Fecha en formato YYYY-MM-DD
 */
export const useCalendarioMensual = (date: string) => {
  return useQuery({
    queryKey: ["calendario", date, "mensual"],
    queryFn: () => calendarioAPI.getEventosMensuales(date),
    select: (data) => data,
    enabled: !!date,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para obtener eventos semanales del calendario
 * @param date - Fecha en formato YYYY-MM-DD
 */
export const useCalendarioSemanal = (date: string) => {

  return useQuery({
    queryKey: ["calendario", date, "semanal"],
    queryFn: () => calendarioAPI.getEventosSemanales(date),
    select: (data) => data,
    enabled: !!date,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};