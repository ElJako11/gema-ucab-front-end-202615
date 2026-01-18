export type Inspeccion = {
    idInspeccion: number;
    titulo?: string;
    fechaCreacion?: Date;
    ubicacion: string;
    estado: "No empezado" | "En ejecución" | "Reprogramado" | "Culminado" | "Cancelado";
    supervisor?: string;
    observacion?: string;
    frecuencia?: "Diaria" | "Semanal" | "Mensual" | "Trimestral" | "Anual";
    areaEncargada: string;
    codigoVerificacion?: string;
    idSupervisor?: number;
    prioridad: "BAJA" | "MEDIA" | "ALTA";
    fechaProximaGeneracion?: string;
};