import { ResumenInspeccion } from "./resumenInspeccion.types";
import { ResumenMantenimiento } from "./resumenMantenimiento.type";

export type resumen = {
    inspecciones: ResumenInspeccion[];
    mantenimientos: ResumenMantenimiento[];
}