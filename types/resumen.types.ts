export type Inspeccion = {
    idInspeccion: number;
    estado: "No Empezado" | "Reprogramado" | "En Ejecucion" | "Culminado";
    ubicacion: string;
    fechaLimite: Date;
    titulo: string;
}

export type Mantenimiento = {
    idMantenimiento: number;
    estado: "No Empezado" | "Reprogramado" | "En Ejecucion" | "Culminado";
    ubicacion: string;
    fechaLimite: Date;
    titulo: string;
}

export type Resumen = {
    inspecciones: Inspeccion[];
    mantenimientos: Mantenimiento[];
}