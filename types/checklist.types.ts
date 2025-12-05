export type actividad = {
    id: number;
    nombre: string;
    descripcion: string;
    estado: 'COMPLETADA' | 'PENDIENTE';
}
export type checklist = {
    id: number;
    data: actividad[];
};