export type Actividad = {
    id: number;
    nombre: string;
    descripcion: string;
    estado: 'COMPLETADA' | 'PENDIENTE';
}
export type Checklist = {
    id: number;
    titulo: string;
    ubicacion: string;
    tareas: Actividad[];
};