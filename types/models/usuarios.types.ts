export type Usuarios = {
  Id: number;
  Nombre: string;
  Correo: string;
  Tipo: "TECNICO" | "COORDINADOR";
  Contraseña: string | undefined;
}[];
