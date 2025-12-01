'use client'

import type { Plantilla } from "@/types/models/plantillas.types";

/**
 * Obtiene listado de plantillas
 */
export async function getPlantillas() {
  // Datos de ejemplo -  Reemplazar con llamada al backend cuando esté disponible
  return Promise.resolve({
    data: [
      {
        id: 1,
        plantilla: "Plantilla de Checklist - Sistema Eléctrico",
        tipo: "Checklist"
      },
      {
        id: 2,
        plantilla: "Plantilla de Mantenimiento - Equipos HVAC",
        tipo: "Mantenimientos por Condición"
      },
      {
        id: 3,
        plantilla: "Plantilla de Checklist - Seguridad",
        tipo: "Checklist"
      }
    ]
  });

  /* Codigo para cuando el backend este disponible:
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No se encontró el token de autenticación");
  }
  
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/plantillas`,
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
    throw new Error(data.error || "Error al obtener las plantillas.");
  }
  
  const data = (await resp.json()) as { data: Plantilla[] };
  return data;
  */
}

