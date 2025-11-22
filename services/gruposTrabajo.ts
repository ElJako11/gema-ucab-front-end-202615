'use client'

export async function createGrupoDeTrabajo(data: {
  codigo: string;
  nombre: string;
  supervisorId: number
}) {
  console.log('[MOCK] Creando grupo de trabajo:', data);
  return Promise.resolve({
    success: true,
    message: 'Grupo de trabajo creado exitosamente'
  });
}

export async function getGruposDeTrabajo() {
  return Promise.resolve({
    data: [
      { id: 1, codigo: "SGMREF", nombre: "Grupo Mantenimiento Refrigeración", supervisorId: 1 },
      { id: 2, codigo: "SGELEC", nombre: "Grupo Electricidad", supervisorId: 2 },
      { id: 3, codigo: "SGMEC", nombre: "Grupo Mecánica Automotriz", supervisorId: 3 },
      { id: 4, codigo: "SGINF", nombre: "Grupo Infraestructura", supervisorId: 4 },
      { id: 5, codigo: "SGJAR", nombre: "Grupo Jardinería y Paisajismo", supervisorId: 5 },
      { id: 6, codigo: "SGSEG", nombre: "Grupo Seguridad Industrial", supervisorId: 6 },
      { id: 7, codigo: "SGLIM", nombre: "Grupo Limpieza y Mantenimiento", supervisorId: 7 },
    ]
  });
}

export async function editGrupoDeTrabajo(data: {
  id: number;
  codigo: string;
  nombre: string;
  supervisorId: number;
}) {
  console.log('[MOCK] Editando grupo:', data);
  return Promise.resolve({
    success: true,
    message: 'Grupo editado exitosamente'
  });
}

export async function deleteGrupoDeTrabajo(id: number) {
  console.log('[MOCK] Eliminando grupo:', id);
  return Promise.resolve({
    success: true,
    message: 'Grupo eliminado exitosamente'
  });
}

export async function getAllWorkersInALLGroups() {
  return Promise.resolve({
    data: [
      {
        grupoDeTrabajoId: 1,
        usuarios: [
          { Id: 1, Nombre: "Técnico 1", Correo: "tec1@ucab.edu.ve" },
          { Id: 2, Nombre: "Técnico 2", Correo: "tec2@ucab.edu.ve" }
        ]
      },
      {
        grupoDeTrabajoId: 2,
        usuarios: [
          { Id: 3, Nombre: "Técnico 3", Correo: "tec3@ucab.edu.ve" },
          { Id: 4, Nombre: "Técnico 4", Correo: "tec4@ucab.edu.ve" },
          { Id: 5, Nombre: "Técnico 5", Correo: "tec5@ucab.edu.ve" }
        ]
      },
      {
        grupoDeTrabajoId: 3,
        usuarios: [
          { Id: 6, Nombre: "Técnico 6", Correo: "tec6@ucab.edu.ve" }
        ]
      },
      {
        grupoDeTrabajoId: 5,
        usuarios: [
          { Id: 7, Nombre: "Técnico 7", Correo: "tec7@ucab.edu.ve" },
          { Id: 8, Nombre: "Técnico 8", Correo: "tec8@ucab.edu.ve" }
        ]
      },
      {
        grupoDeTrabajoId: 6,
        usuarios: [
          { Id: 9, Nombre: "Técnico 9", Correo: "tec9@ucab.edu.ve" }
        ]
      }
    ]
  });
}

export async function addTecnicoToGrupo(data: {
  tecnicoId: number;
  grupoDeTrabajoId: number;
}) {
  console.log('[MOCK] Agregando técnico a grupo:', data);
  return Promise.resolve({ success: true });
}

export async function deleteTecnicoFromGrupo(data: {
  tecnicoId: number;
  grupoDeTrabajoId: number;
}) {
  console.log('[MOCK] Eliminando técnico de grupo:', data);
  return Promise.resolve({ success: true });
}