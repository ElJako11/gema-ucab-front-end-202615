export type ResumenMantenimiento = {
    idMantenimiento: number;
    estado: "No Empezado" | "En Ejecucion" | "Reprogramado" | "Culminado";
    ubicacion: string;
    fechaLimite: Date;
    titulo: string;
};