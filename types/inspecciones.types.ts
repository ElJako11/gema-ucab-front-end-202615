export type Inspeccion = {
    Id: number;
    titulo?: string;
    fechaCreacion: Date;
    ubicacion: string;
    estado: "No empezado" | "En ejecución" | "Reprogramado" | "Culminado" | "Cancelado";
    supervisor: string;
    observacion: string;
    frecuencia: string;
    areaEncargada: string;
    codigoVerificacion?: string;
    idSupervisor?: number; 
};