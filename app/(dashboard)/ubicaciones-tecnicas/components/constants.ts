export const NIVELES = [
    "modulo",
    "planta",
    "espacio",
    "tipo",
    "subtipo",
    "numero",
    "pieza",
] as const;

export type Nivel = (typeof NIVELES)[number];
export type Filters = Record<Nivel, string>;
