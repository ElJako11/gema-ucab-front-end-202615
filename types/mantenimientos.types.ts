export type Mantenimiento = {
    Id: number;
    Titulo?: string; 
    FechaCreacion: Date;
    FechaLimite: Date;
    Ubicacion: string;
    Estado: "No empezado" | "En ejecución" | "Reprogramado" | "Culminado";
    Tipo: "Periodico" | "Por condicion";
    Resumen: string;
    Prioridad: "Baja" | "Media" | "Alta";
    AreaEncargada: string;
    Frecuencia?: "Diaria" | "Semanal" | "Mensual" | "Bimestral" | "Trimestral" | "Semestral" | "Anual";
};