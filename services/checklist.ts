'use client';

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