"use client"
import { useState } from "react";
import {
    ClipboardPen,
    Trash2,
    CirclePlus,
    LoaderCircle,
    Mail,
    User
} from "lucide-react";


import {
    fetchUsuarios as getAllUsuarios,
} from "@/services/usuarios";


import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { CreateUsuarioForm } from "@/components/forms/usuarios/CreateUsuarioForm";
import { EditUsuarioForm } from "@/components/forms/usuarios/EditUsuarioForm";
import { EliminarUsuarioForm } from "@/components/forms/usuarios/EliminarUsuarioForm";
import { Usuario } from "@/types/usuarios.types";

const RegistroUsuarios: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState<any | null>(null);
    const [usuarioEliminar, setUsuarioEliminar] = useState<any | null>(null);

    const usuariosQuery = useQuery({
        queryKey: ["usuarios"],
        queryFn: () => getAllUsuarios(),
    });

    const isLoading = usuariosQuery.isLoading;

    if (isLoading) {
        return (
            <div className="p-6 text-center">
                <LoaderCircle className="animate-spin text-lg" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl">
            <h1 className="text-2xl font-bold mb-3">Registro de Usuarios</h1>

            <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gema-green hover:bg-green-700 mb-6"
            >
                <CirclePlus className="mr-2" />
                Crear nuevo usuario
            </Button>

            <CreateUsuarioForm
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />

            {usuarioEditar && (
                <EditUsuarioForm
                    usuario={usuarioEditar}
                    setUsuario={setUsuarioEditar}
                />
            )}

            {usuarioEliminar && (
                <EliminarUsuarioForm
                    usuario={usuarioEliminar}
                    setUsuario={setUsuarioEliminar}
                />
            )}

            <div className="overflow-x-auto">
                {/* Tabla en desktop */}
                <table className="hidden md:table min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Correo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usuariosQuery.data?.map((usuario: Usuario) => (
                            <tr key={usuario.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-gray-500" />
                                        {usuario.nombre}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        {usuario.correo}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}>
                                        {usuario.tipo}
                                    </span>
                                </td>
                                <td className="flex items-center gap-2 px-6 py-4 whitespace-nowrap text-sm">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="inline-block p-1 border-2 border-gray-200 rounded-sm">
                                                <ClipboardPen
                                                    className="h-5 w-5 text-blue-500 cursor-pointer"
                                                    onClick={() => setUsuarioEditar(usuario)}
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <span>Editar usuario</span>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="inline-block p-1 border-2 border-gray-200 rounded-sm">
                                                <Trash2
                                                    className="h-5 w-5 text-red-500 cursor-pointer"
                                                    onClick={() => setUsuarioEliminar(usuario)}
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <span>Eliminar usuario</span>
                                        </TooltipContent>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Cards en móvil */}
                <div className="md:hidden space-y-4">
                    {usuariosQuery.data?.map((usuario: Usuario) => (
                        <div
                            key={usuario.id}
                            className="bg-white p-4 rounded-lg shadow border border-gray-200"
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 font-medium text-gray-900">
                                        <User className="h-5 w-5 text-gray-500" />
                                        {usuario.nombre}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="p-1 border-2 border-gray-200 rounded-sm">
                                                    <ClipboardPen className="h-5 w-5 text-blue-500" onClick={() => setUsuarioEditar(usuario)} />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>Editar usuario</span>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="p-1 border-2 border-gray-200 rounded-sm">
                                                    <Trash2 className="h-5 w-5 text-red-500" onClick={() => setUsuarioEliminar(usuario)} />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>Eliminar usuario</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Mail className="h-4 w-4" />
                                    {usuario.correo}
                                </div>

                                <div>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.tipo === 'COORDINADOR' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {usuario.tipo}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RegistroUsuarios;
