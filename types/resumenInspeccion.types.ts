export type ResumenInspeccion = {
    idInspeccion: number;
    supervisor: string;
    areaEncargada: string;
    estado: "NO EMPEZADO" | "EN EJECUCION" | "REPROGRAMADO" | "CULMINADO";
    ubicacion: string;
    frecuencia: string;
};