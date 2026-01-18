import { useQuery } from "@tanstack/react-query";
import { calendarioAPI, type FiltroCalendario, type EventoCalendario } from "@/lib/api/calendario";

/**
 * Hook para obtener eventos del calendario (mantenimientos e inspecciones)
 * @deprecated Use useCalendario from hooks/calendario/useCalendario.ts instead
 * Mantenido por compatibilidad con componentes existentes
 */
// Helper para normalizar la fecha (mismo que en useCalendario)
const getMonthKey = (dateString: string) => {
    if (!dateString) return dateString;
    try {
        const parts = dateString.split('-');
        if (parts.length >= 2) {
            return `${parts[0]}-${parts[1]}-01`;
        }
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    } catch (e) {
        return dateString;
    }
};

export const useMantenimientosFiltros = (date: string, filter: string = 'mensual') => {
    const filtroCalendario = (filter === 'semanal' ? 'semanal' : 'mensual') as FiltroCalendario;

    // Normalizar fecha si es mensual (para coincidir con useCalendario)
    const queryKeyDate = filtroCalendario === 'mensual' ? getMonthKey(date) : date;

    return useQuery({
        queryKey: ["calendario", queryKeyDate, filtroCalendario],
        queryFn: async () => {
            try {
                const result = await calendarioAPI.getEventos(date, filtroCalendario);
                return result;
            } catch (error) {
                throw error;
            }
        },
        select: (data) => {
            // DEBUG: Ver datos crudos del API
            console.log("RAW API DATA (useMantenimientosFiltros):", data);

            // Devolver la estructura separada como la devuelve el servidor
            const resultado: {
                inspecciones: EventoCalendario[];
                mantenimientos: EventoCalendario[];
                eventos: EventoCalendario[];
            } = {
                inspecciones: [],
                mantenimientos: [],
                // Mantener compatibilidad con componentes que esperan array único
                eventos: []
            };

            if (data && typeof data === 'object') {
                // Procesar inspecciones
                if (data.inspecciones && Array.isArray(data.inspecciones)) {
                    resultado.inspecciones = data.inspecciones.map((inspeccion: any) => ({
                        ...inspeccion,
                        tipo: 'Inspeccion' as const,
                        id: inspeccion.idInspeccion,
                        ubicacionTecnica: inspeccion.ubicacion,
                        // Para inspecciones, usar fechaCreacion como fecha principal
                        fecha: inspeccion.fechaCreacion || inspeccion.fecha,
                        fechaProximaGeneracion: inspeccion.fechaProximaGeneracion
                    }));
                }

                // Procesar mantenimientos
                if (data.mantenimientos && Array.isArray(data.mantenimientos)) {
                    resultado.mantenimientos = data.mantenimientos.map((mantenimiento: any) => ({
                        ...mantenimiento,
                        tipo: 'Mantenimiento' as const,
                        id: mantenimiento.idMantenimiento,
                        ubicacionTecnica: mantenimiento.ubicacion,
                        fecha: mantenimiento.fechaLimite || mantenimiento.fecha,
                        fechaProximaGeneracion: mantenimiento.fechaProximaGeneracion // Explicit mapping
                    }));
                }

                // Combinar para compatibilidad con componentes existentes
                resultado.eventos = [...resultado.inspecciones, ...resultado.mantenimientos];
            }

            return resultado;
        },
        enabled: !!date,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
    });
};
