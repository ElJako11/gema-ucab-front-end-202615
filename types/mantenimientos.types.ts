export type Mantenimiento = {
    Id: number;
    FechaCreacion: Date;
    FechaLimite: Date;
    Ubicacion: string;
    Estado: "No empezado" | "En ejecución" | "Reprogramado" | "Culminado";
    Tipo: "PREVENTIVO" | "POR CONDICION";
    Resumen: string;
    Prioridad: "BAJA" | "MEDIA" | "ALTA";
    AreaEncargada: string;
};