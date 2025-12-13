export type ResumenMantenimiento = {
    idMantenimiento: number;
    estado: "NO EMPEZADO" | "EN EJECUCION" | "REPROGRAMADO" | "CULMINADO";
    ubicacion: string;
    fechaLimite: string;
};

export type ResumenMantenimientoList = ResumenMantenimiento[];