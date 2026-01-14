import { Frecuencia } from "@/lib/validations/inspeccionSchema";

export type Mantenimiento = {
    id: number;
    titulo: string;
    fechaCreacion: string;
    fechaLimite: string;
    ubicacion: string;
    estado: "No empezado" | "En ejecución" | "Reprogramado" | "Culminado";
    tipo: "Periodico" | "Condicion";
    especificacion?: string;
    resumen?: string;
    prioridad: "BAJA" | "MEDIA" | "ALTA";
    areaEncargada: string;
    frecuencia?: Frecuencia;
    codigoVerificacion: string;
    abreviacion: string;
    codigoArea: string;
    tituloChecklist: string | null;
    idChecklist?: number;
};