// lib/api/ubicacionesTecnicas.ts - VERSIÓN CORREGIDA
import { UbicacionTecnica } from "@/types/models/ubicacionesTecnicas.types";
import { apiClient } from "./client";

/**
 * Obtiene todas las ubicaciones técnicas en forma jerárquica.
 */
export async function getUbicacionesTecnicas(): Promise<{ data: UbicacionTecnica[] }> {
  return apiClient.get("/ubicaciones-tecnicas");
}

/**
 * Obtiene las ubicaciones técnicas dependientes de una ubicación dada.
 */
export async function getUbicacionesDependientes(
  id: number, 
  nivel?: number
): Promise<{ data: UbicacionTecnica[] }> {
  const url = nivel !== undefined 
    ? `/ubicaciones-tecnicas/ramas/${id}?nivel=${nivel}`
    : `/ubicaciones-tecnicas/ramas/${id}`;
  
  return apiClient.get(url);
}

/**
 * Crea una nueva ubicación técnica.
 */
export async function createUbicacionTecnica(params: {
  descripcion: string;
  abreviacion: string;
  padres?: Array<{ idPadre: number; esUbicacionFisica?: boolean }>;
}) {
  // Validación (mantener igual)
  const missingParams: string[] = [];
  if (typeof params.descripcion !== "string" || params.descripcion.trim() === "") {
    missingParams.push("descripcion (debe ser una cadena no vacía)");
  }
  if (typeof params.abreviacion !== "string" || params.abreviacion.trim() === "") {
    missingParams.push("abreviacion (debe ser una cadena no vacía)");
  }
  if (missingParams.length > 0) {
    throw new Error(`Faltan o son inválidos los siguientes parámetros: ${missingParams.join(", ")}.`);
  }

  return apiClient.post("/ubicaciones-tecnicas", params);
}

/**
 * Actualiza una ubicación técnica.
 */
export async function updateUbicacionTecnica(
  id: number,
  params: {
    descripcion?: string;
    abreviacion?: string;
    padres?: Array<{ idPadre: number; esUbicacionFisica?: boolean }>;
  }
) {
  // Validación (mantener igual)
  if (typeof id !== "number" || isNaN(id) || id <= 0) {
    throw new Error("El parámetro 'id' debe ser un número positivo válido.");
  }

  const providedFields: string[] = [];
  if (typeof params.descripcion === "string" && params.descripcion.trim() !== "") {
    providedFields.push("descripcion");
  }
  if (typeof params.abreviacion === "string" && params.abreviacion.trim() !== "") {
    providedFields.push("abreviacion");
  }
  if (params.padres && Array.isArray(params.padres) && params.padres.length > 0) {
    providedFields.push("padres");
  }
  if (providedFields.length === 0) {
    throw new Error("Debe proporcionar al menos uno de los siguientes parámetros válidos para actualizar: descripcion, abreviacion o padres.");
  }

  return apiClient.put(`/ubicaciones-tecnicas/${id}`, params);
}

/**
 * Elimina una ubicación técnica.
 */
export async function deleteUbicacionTecnica(id: number) {
  return apiClient.delete(`/ubicaciones-tecnicas/${id}`);
}

/**
 * Obtiene los padres directos de una ubicación técnica.
 */
export async function getPadresDeUbicacion(idHijo: number) {
  return apiClient.get(`/ubicaciones-tecnicas/padres/${idHijo}`);
}

/**
 * Obtiene las ubicaciones técnicas de un nivel específico.
 */
export async function getUbicacionesPorNivel(nivel: number): Promise<{ data: UbicacionTecnica[] }> {
  return apiClient.get(`/ubicaciones-tecnicas/nivel/${nivel}`);
}

export const ubicacionesAPI = {
  getUbicacionesTecnicas,
  getUbicacionesDependientes,
  createUbicacionTecnica,
  updateUbicacionTecnica,
  deleteUbicacionTecnica,
  getPadresDeUbicacion,
  getUbicacionesPorNivel,
};