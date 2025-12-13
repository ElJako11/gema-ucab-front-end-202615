import { ResumenInspeccion } from "./resumenInspeccion.types";
import { ResumenMantenimiento } from "./resumenMantenimiento.type";

export type CalendarItem = {
    uid: string;
    type: 'inspeccion' | 'mantenimiento';
    data: ResumenInspeccion | ResumenMantenimiento;
};

export type CalendarMap = Record<string, CalendarItem[]>;