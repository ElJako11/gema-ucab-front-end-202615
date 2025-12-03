export type Mantenimiento = {
    Id: number;
    FechaCreacion: Date;
    FechaLimite: Date;
    Ubicacion: string;
    Estado: "NO EMPEZADO" | "EN EJECUCION" | "REPROGRAMADO" | "CULMINADO";
    Resumen: string;
    Prioridad: "BAJA" | "MEDIA" | "ALTA";
    AreaEncargada: string;
};