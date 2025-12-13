export type ResumenInspeccion = {
    IdInspeccion: number;
    Supervisor: string;
    AreaEncargada: string;
    Estado: "NO EMPEZADO" | "EN EJECUCION" | "REPROGRAMADO" | "CULMINADO";
    Ubicacion: string;
    Frecuencia: string;
};