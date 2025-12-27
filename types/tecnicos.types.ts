export type Tecnico = {
  idTecnico: number;
  idGT: number;
  nombre: string;
  correo?: string; // Opcional por si no viene de la API
};

// Tipo para compatibilidad con el código existente
export type TecnicoLegacy = {
  Id: number;
  Nombre: string;
  Correo: string;
};
