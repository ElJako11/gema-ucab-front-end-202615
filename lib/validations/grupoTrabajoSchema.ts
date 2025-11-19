// lib/validations/grupoTrabajoSchema.ts
import { z } from "zod";

export const grupoTrabajoSchema = z.object({
  codigo: z
    .string()
    .min(1, "El código es requerido")
    .min(3, "El código debe tener al menos 3 caracteres"),
  
  nombre: z
    .string()
    .min(1, "El nombre es requerido"),
  
  supervisor: z.coerce
    .number({ message: "El supervisor es requerido" }) // ← CORREGIDO
    .int("El supervisor debe ser un número entero")
    .positive("El supervisor debe ser un ID válido"),
});

export type GrupoTrabajoForm = z.infer<typeof grupoTrabajoSchema>;