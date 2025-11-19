// services/gruposDeTrabajo.ts
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
      { id: 2, codigo: "SGELEC", nombre: "Grupo Electricidad", supervisorId: 2 }
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