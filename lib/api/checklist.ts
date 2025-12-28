"use client";

import apiClient from "@/lib/api/client";
import type { Actividad, Checklist } from "@/types/checklist.types";

export async function getChecklistItems(type: string, Id: number) {
  return apiClient.get<Checklist>(`/${type}/${Id}/checklist`);
}

export async function deleteChecklistItem(checklistId: number, checklistItemId: number) {
  return apiClient.delete(`/item-checklist/${checklistId}/${checklistItemId}`);
}

export async function createChecklist(nombre: string) {
  return apiClient.post<Checklist>(`/checklists`, { nombre });
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
    descripcion: data.descripcion
  };

  return apiClient.patch<Actividad>(`/item-checklist/${checklistId}/${data.id}`, payload);
}
