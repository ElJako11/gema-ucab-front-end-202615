// Tipo que refleja la respuesta real del backend
export type MantenimientoInspeccionAPI = {
  idMantenimiento: number;
  nombre: string;
  uTabreviacion: string;
  uTDescripcion: string;
  trabajo: string;
  inspeccionObservacion: string;
};

// Tipo transformado para el frontend
export type MantenimientoInspeccion = {
  id: number;
  mantenimientoGenerado: string;
  inspeccionAsociada: string;
  ubicacion: string;
  nota: string;
};
