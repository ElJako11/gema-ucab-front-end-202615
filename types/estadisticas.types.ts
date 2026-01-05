export type mantenimientosReabiertos = number;

export type mantenimientosReabiertosPorArea = {
    Grupo: string;
    Total: number;
}[];

export type mantenimientosResumenMesActual = {
    completados: number;
    porcentajeCompletados: number;
    totalMantenimientos: number;
};

export type mantenimientosActivosPorArea = {
    Grupo: string;
    Total: number;
}[];
