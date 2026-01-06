export type Inspeccion = {
    Id: number;
    titulo?: string;
    fechaCreacion: Date;
    ubicacion: string;
    estado: "NO EMPEZADO" | "EN EJECUCION" | "REPROGRAMADO" | "CULMINADO";
    supervisor: string;
    observacion: string;
    frecuencia: string;
    areaEncargada: string;
    codigoVerificacion?: string;
};