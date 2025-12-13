import type { Usuario } from "@/types/usuarios.types";

export type GrupoTrabajo = {
  id: number;
  codigo: string;
  nombre: string;
  supervisorId: number;
  area: string;
};

export type TrabajaEnGrupo = {
  grupoDeTrabajoId: number;
  usuarios: Usuario[];
};
