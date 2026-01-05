export type Usuarios = {
  id: number;
  nombre: string;
  correo: string;
  tipo: 'SUPERVISOR' | 'COORDINADOR' | 'DIRECTOR';
  contraseña: string;
}[];

export type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  tipo: 'SUPERVISOR' | 'COORDINADOR' | 'DIRECTOR';
  contraseña: string;
};
