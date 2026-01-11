export type Mantenimiento = {
    id: number;
    titulo: string; 
    fechaCreacion: string;
    fechaLimite: string;
    ubicacion: string;
    estado: "No empezado" | "En ejecución" | "Reprogramado" | "Culminado";
    tipo: "Periódico" |"Por Condición";
    especificacion: string;
    prioridad: "Baja" | "Media" | "Alta";
    areaEncargada: string;
    frecuencia?: "Diaria" | "Semanal" | "Mensual" | "Trimestral" | "Semestral" | "Anual";
    codigoVerificacion: string; 
    abreviacion: string; 
    codigoArea: string; 
    tituloChecklist: string | null;
};