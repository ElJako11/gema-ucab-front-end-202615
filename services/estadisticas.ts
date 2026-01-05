'use client'

import { apiClient } from "@/lib/api/client";

import type {
    mantenimientosReabiertos,
    mantenimientosReabiertosPorArea,
    mantenimientosResumenMesActual,
    mantenimientosActivosPorArea
} from "@/types/estadisticas.types";

type mantenimientosReabiertosResponse = number;

type mantenimientosReabiertosPorAreaResponse = {
    Grupo: string;
    total: number;  
}[];

type mantenimientosResumenMesActualResponse = {
    completados: number;
    porcentajeCompletados: number;
    totalMantenimientos: number;
};

type mantenimientosActivosPorAreaResponse = {
    grupo: string;
    total: number;  
}[];

export const normalizeMantenimientosReabiertosPorArea = (
    data?: mantenimientosReabiertosPorAreaResponse | null
): mantenimientosReabiertosPorArea | null => {
    if (!data) {
        return null;
    }
    return ( 
        data.map(item => ({  
        Grupo: item.Grupo,
        Total: item.total,
 
    } ))
    
       );
}

export const normalizeMantenimientosResumenMesActual = (
    data?: mantenimientosResumenMesActualResponse | null
): mantenimientosResumenMesActual | null => {
    if (!data) {
        return null;
    }
    return (
        {
        totalMantenimientos: data.totalMantenimientos,
        completados: data.completados,
        porcentajeCompletados: data.porcentajeCompletados
    });
}

export const normalizeMantenimientosActivosPorArea = (
    data?: mantenimientosActivosPorAreaResponse | null
): mantenimientosActivosPorArea | null => {
    
    if (!data) {
        return null;
    }
    return (     

        data.map(item => ({
        Grupo: item.grupo,
        Total: item.total,
    })));
}

export async function getMantenimientosReabiertos(): Promise<mantenimientosReabiertos | null>  {
    const response = await apiClient.get<mantenimientosReabiertosResponse | null>(
        `/trabajos/reabiertos`
      );
      return response ?? null;

}

export async function getMantenimientosReabiertosPorArea(): Promise<mantenimientosReabiertosPorArea | null> {
    const response = await apiClient.get<mantenimientosReabiertosPorAreaResponse>('/trabajos/reabiertos/por-area');

    return(normalizeMantenimientosReabiertosPorArea(response));
}

export async function getMantenimientosResumenMesActual(): Promise<mantenimientosResumenMesActual | null> {
    const response = await apiClient.get<mantenimientosResumenMesActualResponse>('/trabajos/resumen/mes-actual');
    return normalizeMantenimientosResumenMesActual(response);
}

export async function getMantenimientosActivosPorArea(): Promise<mantenimientosActivosPorArea | null> {
    const response = await apiClient.get<mantenimientosActivosPorAreaResponse>('/trabajos/activos/por-area');
    return normalizeMantenimientosActivosPorArea(response);
}