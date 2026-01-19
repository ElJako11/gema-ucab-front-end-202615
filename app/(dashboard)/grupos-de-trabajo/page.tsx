'use client'
import { useState } from "react";
import {
    UserCheck,
    ClipboardPen,
    Trash2,
    CirclePlus,
    LoaderCircle,
} from "lucide-react";


import { Button } from "@/components/ui/button";

import { useAuth } from "@/lib/auth/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// ✅ Usar hooks organizados
import { useGrupos } from "@/hooks/grupos-trabajo/useGrupoTrabajo";
import { useTrabajadoresPorGrupo } from "@/hooks/grupos-trabajo/useTrabajadoresPorGrupo";
import { useSupervisores } from "@/hooks/usuarios/useUsuarios";


import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CreateGrupoForm } from "@/components/forms/grupos/CreateGrupoForm";
import { GestionTecnicosForm } from "@/components/forms/grupos/GestionTecnicosForm";
import { EditGrupoForm } from "@/components/forms/grupos/EditGrupoForm";
import { EliminarGrupoForm } from "@/components/forms/grupos/EliminarGrupoForm";
import type { GrupoTrabajo } from "@/types/grupostrabajo.types";

const GruposTrabajo: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTecnicosModalOpen, setIsTecnicosModalOpen] = useState(false);
    const [selectedGrupoId, setSelectedGrupoId] = useState<number | null>(null);
    const [grupoEditar, setGrupoEditar] = useState<GrupoTrabajo | null>(null);
    const [grupoEliminar, setGrupoEliminar] = useState<GrupoTrabajo | null>(null);

    const { user, isLoading: isLoadingAuth } = useAuth();
    const router = useRouter();

    // ✅ Usar hooks organizados
    const { data: grupos, isLoading: isLoadingGrupos } = useGrupos();
    const { data: trabajadoresPorGrupo, isLoading: isLoadingTrabajadores } = useTrabajadoresPorGrupo();
    const { supervisores, isLoading: isLoadingSupervisores } = useSupervisores();



    const isLoading = isLoadingGrupos || isLoadingSupervisores || isLoadingTrabajadores || isLoadingAuth;

    const openTecnicosModal = (grupoId: number) => {
        setSelectedGrupoId(grupoId);
        setIsTecnicosModalOpen(true);
    };

    const getSupervisorNombre = (id: number | null) =>
        supervisores?.find((s) => s.id === id)?.nombre || "No asignado";

    if (isLoading) {
        return (
            <div className="p-6 text-center">
                <LoaderCircle className="animate-spin text-lg" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl">
            <h1 className="text-2xl font-bold mb-3">Grupos de Trabajo</h1>

            <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gema-green hover:bg-green-700 mb-6"
            >
                <CirclePlus className="mr-2" />
                Crear nuevo grupo
            </Button>

            <CreateGrupoForm
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />

            <GestionTecnicosForm
                open={isTecnicosModalOpen}
                onOpenChange={setIsTecnicosModalOpen}
                grupoTrabajo={
                    grupos?.find((g) => g.id === selectedGrupoId) || null
                }
                trabajadoresPorGrupo={trabajadoresPorGrupo || {}}
            />

            {grupoEditar && (
                <EditGrupoForm
                    grupo={grupoEditar}
                    setGrupo={setGrupoEditar}
                />
            )}

            <EliminarGrupoForm grupo={grupoEliminar} setGrupo={setGrupoEliminar} />

            <div className="w-full rounded-md shadow-sm border border-gray-200">
                {/* Tabla en desktop */}
                <table className="hidden md:table w-full table-fixed bg-white">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Código
                            </th>
                            <th className="w-[30%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre del Grupo
                            </th>
                            <th className="w-[25%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Supervisor
                            </th>
                            <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Técnicos
                            </th>
                            <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {grupos?.map((grupo) => (
                            <tr key={grupo.id}>
                                <td className="px-6 py-4 overflow-hidden border-b border-gray-200">
                                    <div className="flex items-center justify-center border-2 border-gray-300 rounded-lg font-bold w-fit mx-auto px-2">
                                        {grupo.codigo}
                                    </div>
                                </td>
                                <td className="px-6 py-4 overflow-hidden border-b border-gray-200">
                                    <div className="truncate text-sm font-medium text-gray-900" title={grupo.nombre}>
                                        {grupo.nombre}
                                    </div>
                                </td>
                                <td className="px-6 py-4 overflow-hidden border-b border-gray-200">
                                    <div className="flex items-center gap-2 w-full">
                                        <UserCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="truncate text-sm" title={getSupervisorNombre(grupo.supervisorId)}>
                                            {getSupervisorNombre(grupo.supervisorId)}
                                        </span>
                                    </div>
                                </td>
                                <td
                                    className="px-6 py-4 overflow-hidden border-b border-gray-200 cursor-pointer text-center"
                                    onClick={() => openTecnicosModal(grupo.id)}
                                >
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="inline-flex items-center justify-center border-2 border-gray-300 rounded-lg bg-gray-200 font-medium hover:bg-gray-300 transition px-3 py-1">
                                                {trabajadoresPorGrupo?.[grupo.id]?.length || 0}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <span>Ver técnicos</span>
                                        </TooltipContent>
                                    </Tooltip>
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-center gap-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="inline-block p-1 border-2 border-gray-200 rounded-sm">
                                                    <ClipboardPen
                                                        className="h-5 w-5 text-blue-500 cursor-pointer"
                                                        onClick={() => setGrupoEditar(grupo)}
                                                    />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>Editar grupo</span>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="inline-block p-1 border-2 border-gray-200 rounded-sm">
                                                    <Trash2
                                                        className="h-5 w-5 text-red-500 cursor-pointer"
                                                        onClick={() => setGrupoEliminar(grupo)}
                                                    />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>Eliminar grupo</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Cards en móvil */}
                <div className="md:hidden space-y-4">
                    {grupos?.map((grupo) => (
                        <div
                            key={grupo.id}
                            className="bg-white p-4 rounded-lg shadow border border-gray-200"
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="border-2 border-gray-300 rounded-lg font-bold px-3 py-1 text-sm">
                                        {grupo.codigo}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="p-1 border-2 border-gray-200 rounded-sm">
                                                    <ClipboardPen className="h-5 w-5 text-blue-500" onClick={() => setGrupoEditar(grupo)} />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>Editar grupo</span>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="p-1 border-2 border-gray-200 rounded-sm">
                                                    <Trash2 className="h-5 w-5 text-red-500" onClick={() => setGrupoEliminar(grupo)} />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>Eliminar grupo</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-900">{grupo.nombre}</p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <UserCheck className="h-5 w-5 text-green-500" />
                                    <span className="text-sm">
                                        {getSupervisorNombre(grupo.supervisorId)}
                                    </span>
                                </div>

                                <div
                                    className="border-2 border-gray-300 rounded-lg bg-gray-200 font-medium px-3 py-1 inline-block text-sm cursor-pointer hover:bg-gray-300"
                                    onClick={() => openTecnicosModal(grupo.id)}
                                >
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span>{trabajadoresPorGrupo?.[grupo.id]?.length || 0} Técnicos</span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <span>Ver técnicos</span>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GruposTrabajo;
