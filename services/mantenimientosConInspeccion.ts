/**
 * Service para consultar mantenimientos con inspección asociada
 * 
 * NOTA: El endpoint no está desarrollado en el backend.
 * Endpoint esperado: GET /mantenimientos-inspeccion
 */

import type { MantenimientoInspeccion } from "@/types/models/mantenimientosInspeccion.types";

// import { apiClient } from "@/lib/api/client";

// Endpoint esperado (pendiente de backend)
// const ENDPOINT = "/mantenimientos-inspeccion"

/**
 * Datos mock para desarrollo mientras el endpoint no esté disponible
 */
const MOCK_DATA: MantenimientoInspeccion[] = [
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
];

/**
 * Obtiene listado de mantenimientos que tienen una inspección asociada
 * @returns Lista de mantenimientos con inspección
 */
export async function getMantenimientosConInspeccion(): Promise<MantenimientoInspeccion[]> {
    // Datos mock mientras el endpoint no esté disponible
    return Promise.resolve(MOCK_DATA);

    /*
     * Código para cuando el endpoint esté disponible:
     * 
     * Endpoint: GET /mantenimientos-inspeccion
     * 
     * return apiClient.get<MantenimientoInspeccion[]>("/mantenimientos-inspeccion");
     */
}
