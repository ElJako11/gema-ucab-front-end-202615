'use client'

import type { MantenimientoInspeccion, MantenimientoInspeccionAPI } from "@/types/models/mantenimientosInspeccion.types";
import { apiClient } from "@/lib/api/client";

/**
 * Obtiene listado de mantenimientos por inspeccion
 * GET /mantenimientosXinspeccion/resumen
 */
export async function getMantenimientosInspeccion() {
  const response = await apiClient.get<MantenimientoInspeccionAPI[]>("/mantenimientosXinspeccion/resumen");

  // Transformar datos del backend al formato del frontend
  const transformedData: MantenimientoInspeccion[] = response.map((item) => ({
    id: item.idMantenimiento,
    mantenimientoGenerado: item.nombre,
    inspeccionAsociada: item.trabajo,
    ubicacion: `${item.uTabreviacion} - ${item.uTDescripcion}`,
    nota: item.inspeccionObservacion,
  }));

  return { data: transformedData };
}

/**
 * Deriva un mantenimiento desde una inspección
 * POST /mantenimientosXinspeccion
 * @param idInspeccion - ID de la inspección de la cual derivar
 * @param nombre - Nombre del mantenimiento a crear
 */
export async function derivarMantenimiento(idInspeccion: number, nombre: string) {
  const response = await apiClient.post<{ idMantenimiento: number; nombre: string; idInspeccion: number }>(
    "/mantenimientosXinspeccion",
    { idInspeccion, nombre }
  );
  return response;
}
