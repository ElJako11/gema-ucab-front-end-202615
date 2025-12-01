export type MantenimientoInspeccion = {
  id: number;
  mantenimientoGenerado: string;
  inspeccionAsociada: string;
  estado: "culminado" | "no_empezado" | "reprogramado";
  ubicacion: string;
  nota: string;
};

