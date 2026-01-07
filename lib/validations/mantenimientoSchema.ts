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
const PRIORIDAD_OPTS = ['Alta', 'Media', 'Baja'] as const;
export type Prioridad = typeof PRIORIDAD_OPTS[number];

export const mantenimientoSchema = z.object({
  // prioridad as enum (refine is redundant with enum)
  prioridad: z.enum(PRIORIDAD_OPTS, {
    // If you upgrade to zod >= 3.22 you can add required_error here
    // required_error: 'Selecciona una prioridad válida',
    // invalid_type_error: 'Selecciona una prioridad válida',
  }),

  // areaEncargada as enum; trim before validating
  areaEncargada: z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z.enum(AREA_OPTIONS, {
      // In older Zod you can’t pass required_error here.
      // invalid_type_error: 'El área encargada es requerida', // only on newer Zod
    })
  ),

  estado: z.enum(['no_empezado', 'reprogramado', 'en_ejecucion', 'culminado'] as const),

  supervisor: z
    .string()
    .min(1, "Selecciona un supervisor"),
  
  fechaInicio: z
    .string()
    .min(1, "La fecha de inicio es requerida"),
  
  fechaFin: z
    .string()
    .min(1, "La fecha de finalización es requerida"),
  
  tipoMantenimiento: z
    .enum(["Periodico", "Condicion"])
    .refine((val) => ["Periodico", "Condicion"].includes(val), {
      message: "Selecciona un tipo de mantenimiento válido"
    }),
  
  repeticion: z
    .enum(["unico", "periodico"])
    .refine((val) => ["unico", "periodico"].includes(val), {
      message: "Selecciona un tipo de repetición válido"
    }),
  
  frecuencia: z
    .enum(["Diaria", "Semanal", "Mensual", "Bimestral", "Trimestral", "Semestral", "Anual"])
    .optional(),
  
  idUbicacionTecnica: z
    .number()
    .min(1, "Selecciona una ubicación técnica"),
  
  idGrupo: z
    .number()
    .min(1, "Selecciona un grupo de trabajo"),
  
  especificacion: z
    .string()
    .min(1, "El resumen es requerido")
    .max(1000, "El resumen no puede exceder 1000 caracteres")
});

// If you need a custom “required” message on older Zod, you can layer a refine:
export const mantenimientoSchemaWithMsgs = mantenimientoSchema.extend({
  areaEncargada: z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z.enum(AREA_OPTIONS)
  ).refine((v) => AREA_OPTIONS.includes(v as AreaEncargada), {
    message: 'El área encargada es requerida',
  }),
});