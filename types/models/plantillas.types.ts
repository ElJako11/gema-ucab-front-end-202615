import type { Actividad } from "@/types/checklist.types";

export type Plantilla = {
  id: number;
  plantilla: string;
  tipo: string;
  actividades?: Actividad[];
};

// Backend response types
export type BackendPlantilla = {
  idPlantilla: number;
  nombre: string;
};

export type BackendItem = {
  idItemPlantilla: number;
  idPlantilla: number;
  titulo: string;
  descripcion: string;
};

export type BackendPlantillaWithItems = BackendPlantilla & {
  items: BackendItem[];
};
