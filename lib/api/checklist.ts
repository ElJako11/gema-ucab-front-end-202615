"use client";

import apiClient from "@/lib/api/client";
import type { Actividad, Checklist } from "@/types/checklist.types";

export async function getChecklistItems(checklistId: number) {
  return apiClient.get<Checklist>(`/checklist/${checklistId}`);
}

export async function deleteChecklistItem(checklistId: number,checklistItemId: number) {
  return apiClient.delete(`/item-checklist/${checklistId}/${checklistItemId}`);
}

export async function createChecklist(nombre: string) {
  return apiClient.post<Checklist>(`/checklist`, { nombre });
}

export async function createChecklistItem(checklistId: number, data: Actividad) {
  return apiClient.post<Checklist>(`/item-checklist/${checklistId}/item`, data);
}

export async function updateChecklistItem(checklistId: number, data: Actividad) {
  return apiClient.put<Checklist>(`/item-checklist/${checklistId}`, data);
}
