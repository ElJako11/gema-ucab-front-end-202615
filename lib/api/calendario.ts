import { Inspeccion } from "@/types/inspecciones.types";
import apiClient from "./client";
import { Mantenimiento } from "@/types/mantenimientos.types";



export interface CalendarioResponse {
    inspecciones?: Inspeccion[];
    mantenimientos?: Mantenimiento[];
}

export type FiltroCalendario = "mensual" | "semanal";

export const calendarioAPI = {
  /**
   * Obtiene los eventos del calendario (mantenimientos e inspecciones) para una fecha y filtro específicos
   * @param date - Fecha en formato YYYY-MM-DD
   * @param filter - Tipo de filtro: "mensual" o "semanal"
   */
  async getEventos(date: string, filter: FiltroCalendario): Promise<CalendarioResponse> {
    return apiClient.get<CalendarioResponse>(`/calendario?date=${date}&filter=${filter}`);
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