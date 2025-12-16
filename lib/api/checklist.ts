"use client";

import apiClient from "@/lib/api/client";
import type { Actividad } from "@/types/checklist.types";

export async function deleteChecklistItem(id: number) {
  return apiClient.delete(`/checklist/${id}`);
}

export async function createChecklistItem(data: Actividad) {
  return apiClient.post(`/checklist/${data.id}`, data);
}

export async function updateChecklistItem(data: Actividad) {
  return apiClient.put(`/checklist/${data.id}`, data);
}
