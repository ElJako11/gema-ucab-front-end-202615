"use client";

import apiClient from "@/lib/api/client";
import type { Actividad, ApiChecklistResponse, Checklist } from "@/types/checklist.types";

export async function getChecklistItems(checklistId: number) {
  const response = await apiClient.get<ApiChecklistResponse>(`/checklists/${checklistId}`);

  const serverData = response.data;

  const checklistAdaptado: Checklist = {
    id: serverData.idChecklist,
    titulo: serverData.nombre,
    ubicacion: "Ubicación no disponible", 
    tareas: serverData.items.map(item => ({
      id: item.idItemCheck,
      nombre: item.titulo,          
      descripcion: item.descripcion,
      estado: "PENDIENTE"            // ⚠️ IMPORTANTE: Como la API no trae estado, forzamos uno por defecto
    }))
  };

  return checklistAdaptado;
}

export async function deleteChecklistItem(checklistId: number,checklistItemId: number) {
  return apiClient.delete(`/item-checklist/${checklistId}/${checklistItemId}`);
}

export async function createChecklist(nombre: string) {
  return apiClient.post<Checklist>(`/checklists`, { nombre });
}

export async function createChecklistItem(checklistId: number, data: Actividad) {
  return apiClient.post<Checklist>(`/item-checklist/${checklistId}/item`, data);
}

export async function updateChecklistItem(checklistId: number, data: Actividad) {
  return apiClient.put<Checklist>(`/item-checklist/${checklistId}`, data);
}
