"use client";

import apiClient from "@/lib/api/client";
import type { Actividad, Checklist } from "@/types/checklist.types";

export async function getChecklistItems(type: string, Id: number) {
  return apiClient.get<Checklist>(`/${type}/${Id}/checklist`);
}

export async function deleteChecklistItem(checklistId: number, checklistItemId: number) {
  return apiClient.delete(`/item-checklist/${checklistId}/${checklistItemId}`);
}

export async function createChecklistItem(checklistId: number, data: Actividad) {
  const payload = {
    idChecklist: checklistId,
    titulo: data.nombre,
    descripcion: data.descripcion
  };

  console.log("Payload para crear actividad:", payload); // Debug

  return apiClient.post<Actividad>(`/item-checklist`, payload);
}

export async function updateChecklistItem(checklistId: number, data: Actividad) {
  const payload = {
    titulo: data.nombre,
    descripcion: data.descripcion,
    estado: data.estado
  };

  return apiClient.patch<Actividad>(`/item-checklist/${checklistId}/${data.id}`, payload);
}

export async function exportChecklistPDF(checklistId: number) {
  // responseType: 'blob' indica que esperamos un archivo binario
  return apiClient.get<Blob>(`/pdf-checklists/${checklistId}/pdf`, {
    responseType: 'blob'
  });
}

export async function updateChecklistStatus(idTrabajo: number, checklistId: number, itemId: number) {
  return apiClient.patch(`/estado-item/${idTrabajo}/${checklistId}/${itemId}`, undefined);
}

export async function createChecklistfromPlantilla(idInspeccion: string, idMantenimiento: string, idPlantilla: string) {
  return apiClient.post(`/work-creation/checklist-template`, { idInspeccion, idMantenimiento, idPlantilla });
}

export async function createChecklist(nombre: string, idInspeccion: string, idMantenimiento: string) {
  return apiClient.post(`/checklists`, { nombre, idInspeccion, idMantenimiento });
}