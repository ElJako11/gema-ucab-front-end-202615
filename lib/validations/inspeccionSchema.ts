import { z } from "zod";

export const AREA_OPTIONS = [
  "Electricidad",
  "Infraestructura",
  "Mecanica",
  "Refrigeracion",
  "Logistica",
] as const;
export type AreaEncargada = typeof AREA_OPTIONS[number];

export const PRIORIDAD_OPTS = ["Baja", "Media", "Alta"] as const;
export type Prioridad = typeof PRIORIDAD_OPTS[number];

export const FRECUENCIA_OPTS = ["Diaria", "Semanal", "Mensual", "Anual"] as const;
export type Frecuencia = typeof FRECUENCIA_OPTS[number];

export const ESTADO_OPTS = ["Programado", "En_proceso", "Realizado", "Cancelado", "Reprogramado"] as const;
export type Estado = typeof ESTADO_OPTS[number];

export const inspeccionSchema = z.object({
  // Campos visibles en tu form/defaults
  titulo: z.string().min(1, "El título es requerido"),
  estado: z.enum(ESTADO_OPTS),
  prioridad: z.enum(PRIORIDAD_OPTS),
  areaEncargada: z.enum(AREA_OPTIONS),

  // Ubicación técnica y grupo
  idUbicacionTecnica: z.number().min(1, "Selecciona una ubicación técnica"),
  idGrupo: z.number().min(1, "Selecciona un grupo de trabajo"),

  // Supervisor y fechas
  supervisor: z.string().min(1, "Selecciona un supervisor"),
  fechaCreacion: z.string().min(1, "La fecha de creación es requerida"),
  fechaLimite: z.string().min(1, "La fecha límite es requerida"),

  // Frecuencia y cada cuánto
  frecuencia: z.enum(FRECUENCIA_OPTS),
  cadaCuanto: z.number().int().positive().optional(),

  // Texto libre
  observacion: z.string().min(1, "La observación es requerida"),

  // Extras que usas en defaults (sin controles en el form ahora)
  codigoVerificacion: z.string().optional(),
  codigoArea: z.string().optional(),
});

export type InspeccionFormData = z.infer<typeof inspeccionSchema>;