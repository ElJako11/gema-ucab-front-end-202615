import { z } from "zod";

// Keep your single source of truth for allowed areas
export const AREA_OPTIONS = [
  'Electricidad',
  'Infraestructura',
  'Mecanica',
  'Refrigeracion',
  'Logistica',
] as const;
export type AreaEncargada = typeof AREA_OPTIONS[number];

// If you also have prioridad options, define them as const too
export const PRIORIDAD_OPTS = ['ALTA', 'MEDIA', 'BAJA'] as const;
export const FRECUENCIAS = ["Diaria","Semanal","Mensual","Trimestral","Anual"]; 
export type Prioridad = typeof PRIORIDAD_OPTS[number];

export const mantenimientoSchema = z.object({
  // prioridad as enum (refine is redundant with enum)
  tipoTrabajo: z.literal("Mantenimiento"),
  titulo: z.string().min(1, "El nombre es requerido").max(200, "Máximo 200 caracteres"),
  prioridad: z.enum(PRIORIDAD_OPTS),

  // Ubicación técnica y grupo
  idUbicacionTecnica: z.number().min(1, "Selecciona una ubicación técnica"),
  idGrupo: z.number().min(1, "Selecciona un grupo de trabajo"),

  fechaCreacion: z
    .string()
    .min(1, "La fecha de inicio es requerida"),

  fechaLimite: z
    .string()
    .min(1, "La fecha límite es requerida"),

  tipo: z
    .enum(["Periodico", "Condicion"])
    .refine((val) => ["Periodico", "Condicion"].includes(val), {
      message: "Selecciona un tipo de mantenimiento válido"
    }),

  frecuencia: z
    .enum(["Diaria","Semanal","Mensual","Trimestral","Anual"])
    .optional(),

  resumen: z
    .string()
    .max(1000, "El especificacion no puede exceder 1000 caracteres")
});

export const mantenimientoEditSchema = z.object({
  titulo: z.string().max(200, "Máximo 200 caracteres").optional(),
  prioridad: z.enum(PRIORIDAD_OPTS).optional(),

  fechaLimite: z
    .string()
    .optional(),

  tipo: z
    .enum(["Periodico", "Condicion"])
    .optional(),

  frecuencia: z
    .enum(["Diaria","Semanal","Mensual","Trimestral","Anual"])
    .optional(),

  resumen: z
    .string()
    .max(1000, "El resumen no puede exceder 1000 caracteres")
    .optional()
});



// Exportar el tipo usado por los formularios
export type MantenimientoFormData = z.infer<typeof mantenimientoSchema>;