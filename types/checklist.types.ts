export type Actividad = {
    id: number;
    nombre: string;
    descripcion: string;
    estado: 'COMPLETADA' | 'PENDIENTE';
}
export type Checklist = {
    idTrabajo: number;
    id: number;
    titulo: string;
    ubicacion: string;
    tareas: Actividad[];
};

export interface ApiItem {
    idItemCheck: number;
    idCheck: number;
    titulo: string;
    descripcion: string;
    // FALTA EL ESTADO QUE NO VIENE DE LA API
}

export interface ApiChecklistResponse {
    data: {
        idChecklist: number;
        nombre: string;
        items: ApiItem[];
    }
}