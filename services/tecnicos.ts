// services/tecnicos.ts - ARCHIVO TEMPORAL
import type { Tecnico } from "@/types/tecnicos.types";

export async function createTecnico(data: Tecnico) {
  // Mock temporal para compilar
  console.log('Mock: Creando técnico', data);
  return Promise.resolve({
    success: true,
    message: 'Técnico creado exitosamente (mock)'
  });
}

export async function getTecnicos(): Promise<{ data: Tecnico[] }> {
  return Promise.resolve({
    data: [
      {
        Id: 1,
        Nombre: "Técnico Demo",
        Correo: "demo@ucab.edu.ve",
        // Asegúrate de incluir todas las propiedades requeridas por el tipo Tecnico
        Tipo: "Técnico", // si existe en el tipo
        Contraseña: "" // si existe en el tipo
      }
    ]
  });
}