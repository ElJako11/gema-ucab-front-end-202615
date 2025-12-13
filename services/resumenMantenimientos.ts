import { apiClient } from "@/lib/api/client";

import type {
  ResumenMantenimiento,
  ResumenMantenimientoList,
} from "@/types/resumenMantenimiento.type";

type ResumenMantenimientoResponse = {
  idMantenimiento: number;
  estado: string;
  ubicacion: string;
  fechaLimite: string;
};

const normalizeResumenMantenimiento = (
  data?: ResumenMantenimientoResponse | null
): ResumenMantenimiento | null => {
  if (!data) {
    return null;
  }

  return {
    idMantenimiento: data.idMantenimiento,
    estado: data.estado as ResumenMantenimiento["estado"],
    ubicacion: data.ubicacion,
    fechaLimite: data.fechaLimite,
  };
};

export const getResumenMantenimiento = async (
  id: number | string
): Promise<ResumenMantenimiento | null> => {
  const response = await apiClient.get<ResumenMantenimientoResponse | null>(
    `/mantenimientos/${id}`
  );

  return normalizeResumenMantenimiento(response);
};

export const getResumenMantenimientos = async (params: {
  date?: string;
  filter?: "mensual" | "semanal";
}): Promise<ResumenMantenimientoList> => {
  const { date, filter = "semanal" } = params;

  const queryParams = new URLSearchParams();

  if (date) {
    queryParams.set("date", date);
  }

  if (filter) {
    queryParams.set("filter", filter);
  }

  const response = await apiClient.get<ResumenMantenimientoResponse[]>(
    `/mantenimientos/filtros?${queryParams.toString()}`
  );

  if (!Array.isArray(response)) {
    return [];
  }

  return response
    .map((item) => normalizeResumenMantenimiento(item))
    .filter((item): item is ResumenMantenimiento => item !== null);
};
