"use client"

import type { Plantillas } from "@/types/plantillas.types";
import apiClient from "./client";

export async function getPlantillas() {
    return apiClient.get<Plantillas>("/plantillas");
}