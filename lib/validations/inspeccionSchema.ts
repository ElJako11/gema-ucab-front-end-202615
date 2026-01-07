import { z } from "zod";

const AREA_OPTIONS = [
  "Electricidad",
  "Infraestructura",
  "Mecanica",
  "Refrigeracion",
  "Logistica"
] as const;

export const inspeccionSchema = z.object({
  estado: z.string().min(1, "El estado es requerido"),
  supervisor: z.string().min(1, "El supervisor es requerido"),
  areaEncargada: z
    .string({ required_error: "El área encargada es requerida" })
    .trim()
    .min(1, "El área encargada es requerida")
    .refine((val) => (AREA_OPTIONS as readonly string[]).includes(val), {
      message: "El área encargada es requerida"
    }),
  idUbicacionTecnica: z.number().min(1, "La ubicación técnica es requerida"),
  frecuencia: z.string().min(1, "La frecuencia es requerida"),
  cadaCuanto: z.number().optional(),
  observacion: z.string().min(1, "El resumen es requerido"),
  prioridad: z.string().min(1, "La prioridad es requerida"),
  fechaLimite: z.string().min(1, "La fecha límite es requerida"),
  idGrupo: z.number().min(1, "El grupo de trabajo es requerido"),
});

export type InspeccionFormData = z.infer<typeof inspeccionSchema>;