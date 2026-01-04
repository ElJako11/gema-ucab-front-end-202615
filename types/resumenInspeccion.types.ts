export type ResumenInspeccion = {
    idInspeccion: number;
    titulo: string;
    supervisor: string;
    areaEncargada: string;
    estado: "No Empezado" | "En Ejecucion" | "Reprogramado" | "Culminado";
    ubicacion: string;
    frecuencia: string;
};