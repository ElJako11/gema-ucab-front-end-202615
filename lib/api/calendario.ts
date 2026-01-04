import apiClient from "./client";

// Tipos para el calendario
export interface EventoCalendario {
  // Campos comunes
  id?: number;
  titulo?: string;
  fecha?: string;
  tipo?: "Mantenimiento" | "Inspeccion";
  prioridad?: "Alta" | "Media" | "Baja";
  estado?: string;
  ubicacionTecnica?: string;
  ubicacion?: string;
  supervisor?: string;
  grupo?: string;
  
  // Campos específicos de mantenimientos
  idMantenimiento?: number;
  fechaLimite?: string;
  nombre?: string;
  
  // Campos específicos de inspecciones  
  idInspeccion?: number;
  
  // Permitir campos adicionales para flexibilidad
  [key: string]: any;
}

export interface CalendarioResponse {
  inspecciones?: EventoCalendario[];
  mantenimientos?: EventoCalendario[];
  // Mantener compatibilidad con estructura anterior
  data?: EventoCalendario[];
}

export type FiltroCalendario = "mensual" | "semanal";

export const calendarioAPI = {
  /**
   * Obtiene los eventos del calendario (mantenimientos e inspecciones) para una fecha y filtro específicos
   * @param date - Fecha en formato YYYY-MM-DD
   * @param filter - Tipo de filtro: "mensual" o "semanal"
   */
  async getEventos(date: string, filter: FiltroCalendario): Promise<CalendarioResponse> {
    try {
      const endpoint = `/calendario?date=${date}&filter=${filter}`;
      const response = await apiClient.get<CalendarioResponse>(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene eventos mensuales para una fecha específica
   * @param date - Fecha en formato YYYY-MM-DD
   */
  async getEventosMensuales(date: string): Promise<CalendarioResponse> {
    return this.getEventos(date, "mensual");
  },

  /**
   * Obtiene eventos semanales para una fecha específica
   * @param date - Fecha en formato YYYY-MM-DD
   */
  async getEventosSemanales(date: string): Promise<CalendarioResponse> {
    return this.getEventos(date, "semanal");
  }
};