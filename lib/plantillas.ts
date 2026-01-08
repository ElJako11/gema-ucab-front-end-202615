'use client'

import apiClient from "@/lib/api/client";
import type {
  Plantilla,
  BackendPlantilla,
  BackendPlantillaWithItems
} from "@/types/models/plantillas.types";

/**
 * Mapea una plantilla del backend al formato del frontend
 */
function mapBackendToFrontend(backend: BackendPlantilla): Plantilla {
  return {
    id: backend.idPlantilla,
    plantilla: backend.nombre,
    tipo: "Checklist", // Todas las plantillas son de tipo Checklist
  };
}

/**
 * Mapea una plantilla con items del backend al formato del frontend
 */
function mapBackendWithItemsToFrontend(backend: BackendPlantillaWithItems): Plantilla {
  return {
    id: backend.idPlantilla,
    plantilla: backend.nombre,
    tipo: "Checklist",
    actividades: backend.items.map(item => ({
      id: item.idItemPlantilla,
      nombre: item.titulo,
      descripcion: item.descripcion,
      estado: item.estado || 'PENDIENTE',
    })),
  };
}

/**
 * Obtiene listado de plantillas
 */
export async function getPlantillas() {
  const plantillas = await apiClient.get<BackendPlantilla[]>("/plantillas");
  return {
    data: plantillas.map(mapBackendToFrontend)
  };
}

/**
 * Obtiene una plantilla por su ID con sus items
 */
export async function getPlantillaById(id: number): Promise<Plantilla | null> {
  try {
    const plantilla = await apiClient.get<BackendPlantillaWithItems>(`/plantillas/${id}`);
    return mapBackendWithItemsToFrontend(plantilla);
  } catch (error) {
    console.error(`Error al obtener plantilla ${id}:`, error);
    return null;
  }
}

/**
 * Crea una nueva plantilla
 */
export async function createPlantilla(data: Omit<Plantilla, "id">) {
  const backendPayload = { nombre: data.plantilla };
  const result = await apiClient.post<BackendPlantilla>("/plantillas", backendPayload);
  return mapBackendToFrontend(result);
}

/**
 * Actualiza una plantilla existente
 */
export async function updatePlantilla(id: number, data: Partial<Plantilla>) {
  const backendPayload = { nombre: data.plantilla };
  const result = await apiClient.put<BackendPlantilla>(`/plantillas/${id}`, backendPayload);
  return mapBackendToFrontend(result);
}

/**
 * Elimina una plantilla
 */
export async function deletePlantilla(id: number) {
  return apiClient.delete<{ message: string }>(`/plantillas/${id}`);
}
