import { useQuery } from "@tanstack/react-query";
import { getMantenimientosReabiertos, getMantenimientosActivosPorArea,getMantenimientosReabiertosPorArea,getMantenimientosResumenMesActual } from "@/services/estadisticas";

export const useMantenimientosReabiertos = () => {
  return useQuery({
    queryKey: ["estadisticas", "mantenimientosReabiertos"],
    queryFn: getMantenimientosReabiertos
  });
}

export const useMantenimientosReabiertosPorArea = () => {
  return useQuery({
    queryKey: ["estadisticas", "mantenimientosReabiertosPorArea"],
    queryFn: getMantenimientosReabiertosPorArea
  });
}

export const useMantenimientosResumenMesActual = () => {
  return useQuery({
    queryKey: ["estadisticas", "mantenimientosResumenMesActual"],
    queryFn: getMantenimientosResumenMesActual
  });
}
export const useMantenimientosActivosPorArea = () => {
  return useQuery({
    queryKey: ["estadisticas", "mantenimientosActivosPorArea"],
    queryFn: getMantenimientosActivosPorArea
  });
}

