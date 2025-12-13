'use client';

import type { Actividad } from "@/types/checklist.types";

export async function deleteChecklistItem(id: number) {
    //Peticion al backend para eliminar el item del checklist
    const response = await fetch(`http://localhost:3000/checklist/${id}`, {
        method: 'DELETE',
    });

    //verificar respuesta
    if (!response.ok) {
        throw new Error('Error al eliminar el item del checklist');
    }

    //retornar respuesta
    return response.json();
}

export async function createChecklistItem(data: Actividad) {
  // Peticion al backend
  const response = await fetch(`http://localhost:3000/checklist/${data.id}`, {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear la actividad');
  }

  return response.json();
}

export async function updateChecklistItem(data: Actividad) {
  // Peticion al backend
  const response = await fetch(`http://localhost:3000/checklist/${data.id}`, {  
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear la actividad');
  }

  return response.json();
}