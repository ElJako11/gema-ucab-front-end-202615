// validators/ubicacionTecnicaSchema.ts - VERSIÓN CORREGIDA
import { z } from "zod";

/**
 * Schema para validar los datos de una ubicación técnica.
 * @description Utiliza Zod para definir las reglas de validación basadas en los tipos del backend.
 * @author janbertorelli
 */
export const ubicacionTecnicaSchema = z.object({
  descripcion: z
    .string()
    .min(1, "La descripción es requerida")
    .max(50, "La descripción debe tener como máximo 50 caracteres"),
  abreviacion: z
    .string()
    .min(1, "La abreviación es requerida")
    .max(5, "La abreviación debe tener como máximo 5 caracteres"),
  padres: z
    .array(
      z.object({
        idPadre: z.number().min(1, "El idPadre es requerido"),
        esUbicacionFisica: z.boolean().optional(),
      })
    )
    .optional(),
});