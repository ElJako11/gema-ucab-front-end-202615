import { z } from "zod";

export const AREA_OPTIONS = [
  "Electricidad",
  "Infraestructura",
  "Mecanica",
  "Refrigeracion",
  "Logistica",
] as const;
export type AreaEncargada = typeof AREA_OPTIONS[number];

export const PRIORIDAD_OPTS = ["BAJA", "MEDIA", "ALTA"] as const;
export type Prioridad = typeof PRIORIDAD_OPTS[number];

export const FRECUENCIA_OPTS = ["Diaria", "Semanal", "Mensual", "Trimestral", "Anual"] as const;
export type Frecuencia = typeof FRECUENCIA_OPTS[number];

export const ESTADO_OPTS = ["Programado", "En_proceso", "Realizado", "Cancelado", "Reprogramado"] as const;
export type Estado = typeof ESTADO_OPTS[number];