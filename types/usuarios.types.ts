export type Usuario = {
  Id: number;
  Nombre: string;
  Correo: string;
  Tipo: "DIRECTOR" | "COORDINADOR" | "SUPERVISOR";
  Contraseña?: string; // Opcional para mayor flexibilidad
};
