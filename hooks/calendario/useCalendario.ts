import { useQuery } from "@tanstack/react-query";
import { calendarioAPI, type FiltroCalendario } from "@/lib/api/calendario";

/**
 * Hook para obtener eventos del calendario
 * @param date - Fecha en formato YYYY-MM-DD
 * @param filter - Tipo de filtro: "mensual" o "semanal"
 */
// Helper para normalizar la fecha al primer día del mes para el query key
// Esto asegura que navegar entre días/semanas del mismo mes use la misma caché
const getMonthKey = (dateString: string) => {
  if (!dateString) return dateString;
  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
  } catch (e) {
    return dateString;
  }
};

/**
 * Hook para obtener eventos del calendario
 * @param date - Fecha en formato YYYY-MM-DD
 * @param filter - Tipo de filtro: "mensual" o "semanal"
 */
export const useCalendario = (date: string, filter: FiltroCalendario) => {
  // Solo normalizamos si el filtro es mensual para compartir caché
  // Si el filtro es semanal strict, quizás queramos mantener keys separadas, pero 
  // la estrategia actual es mover todo a fetching mensual.
  const queryKeyDate = filter === 'mensual' ? getMonthKey(date) : date;

  return useQuery({
    queryKey: ["calendario", queryKeyDate, filter],
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
    queryKey: ["calendario", getMonthKey(date), "mensual"],
    queryFn: () => calendarioAPI.getEventosMensuales(date),
    select: (data) => data,
    enabled: !!date,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para obtener eventos semanales del calendario
 * AHORA: Usa el fetching mensual para aprovechar el caché del calendario mensual.
 * La vista semanal filtrará los datos en el cliente.
 * @param date - Fecha en formato YYYY-MM-DD
 */
export const useCalendarioSemanal = (date: string) => {

  return useQuery({
    // Usamos la misma key que el mensual: fecha normalizada + "mensual"
    queryKey: ["calendario", getMonthKey(date), "mensual"],
    // Usamos el endpoint mensual
    queryFn: () => calendarioAPI.getEventosMensuales(date),
    select: (data) => data,
    enabled: !!date,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};