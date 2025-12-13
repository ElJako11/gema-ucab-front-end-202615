export type ResumenMantenimiento = {
    IdMantenimiento: number;
    Estado: "NO EMPEZADO" | "EN EJECUCION" | "REPROGRAMADO" | "CULMINADO";
    Ubicacion: string;
    FechaLimite: Date;
};