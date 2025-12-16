'use client'

export async function crearUsuario(data: {

    nombre: string;
    correo: string;
    tipo: string;
}) {
    console.log('[MOCK] Creando usuario:', data);
    return Promise.resolve({
        success: true,
        message: 'Usuario creado exitosamente'
    });
}

export async function getUsuarios() {
    return Promise.resolve({
        data: [
            { id: 1, nombre: "María Palma", correo: "correo1@hotmail.com", tipo: "técnico" },
            { id: 2, nombre: "Alfonso Palma", correo: "correo2@hotmail.com", tipo: "técnico" },
            { id: 3, nombre: "Juan Márquez", correo: "correo3@hotmail.com", tipo: "técnico" },
            { id: 4, nombre: "María Márquez", correo: "correo4@hotmail.com", tipo: "técnico" },
            { id: 5, nombre: "Juan Palma", correo: "correo5@hotmail.com", tipo: "técnico" },
            { id: 6, nombre: "María Márquez", correo: "correo6@hotmail.com", tipo: "técnico" },
            { id: 7, nombre: "Juan Márquez", correo: "correo7@hotmail.com", tipo: "técnico" },

        ]
    });
}

export async function editUsuario(data: {
    id: number;
    nombre: string;
    correo: string;
    tipo: string;
}) {
    console.log('[MOCK] Editando usuario:', data);
    return Promise.resolve({
        success: true,
        message: 'Usuario editado exitosamente'
    });
}

export async function deleteUsuario(id: number) {
    console.log('[MOCK] Eliminando Usuario:', id);
    return Promise.resolve({
        success: true,
        message: 'Usuario eliminado exitosamente'
    });
}
