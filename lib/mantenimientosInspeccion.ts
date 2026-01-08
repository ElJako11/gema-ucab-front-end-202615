'use client'

import type { MantenimientoInspeccion } from "@/types/models/mantenimientosInspeccion.types";
import { apiClient } from "@/lib/api/client";

/**
 * Obtiene listado de mantenimientos por inspeccion
 */
export async function getMantenimientosInspeccion() {
  // Datos de ejemplo - Reemplazar con llamada al backend cuando esté disponible
  return Promise.resolve({
    data: [
      {
        id: 1,
        mantenimientoGenerado: "Mantenimiento Preventivo - Sistema de Aire Acondicionado",
        inspeccionAsociada: "Inspección Técnica #2024-001 - Revisión de equipos HVAC",
        estado: "culminado",
        ubicacion: "M1-P01 Módulo 1 Piso 1",
        nota: "- Requiere revisión de filtros y limpieza de conductos"
      },
      {
        id: 2,
        mantenimientoGenerado: "Mantenimiento Correctivo - Sistema Eléctrico",
        inspeccionAsociada: "Inspección Técnica #2024-015 - Análisis de fallas eléctricas",
        estado: "no_empezado",
        ubicacion: "M2-P2 Módulo 2 Piso 2",
        nota: "- Se detectaron irregularidades en el sistema de distribución"
      },
      {
        id: 3,
        mantenimientoGenerado: "Mantenimiento Preventivo - Sistema de Seguridad",
        inspeccionAsociada: "Inspección Técnica #2024-008 - Verificación de sistemas de seguridad",
        estado: "reprogramado",
        ubicacion: "M2-P2 Módulo 2 Piso 2",
        nota: "- Pendiente de reprogramación por disponibilidad de técnicos"
      }
    ]
  });

  /* Codigo para cuando el backend este disponible:
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No se encontró el token de autenticación");
  }
  
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mantenimientos-inspeccion`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  if (!resp.ok) {
    const data = await resp.json();
    throw new Error(data.error || "Error al obtener los mantenimientos por inspección.");
  }
  
  const data = (await resp.json()) as { data: MantenimientoInspeccion[] };
  return data;
  */
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
