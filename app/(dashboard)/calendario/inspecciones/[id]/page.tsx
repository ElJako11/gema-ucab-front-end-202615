'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { EditInspectionModal } from "@/components/forms/inspecciones/EditInspectionModal";
import { DeleteInspectionModal } from "@/components/forms/inspecciones/DeleteInspectionModal";
import { DeriveMaintenanceModal } from "@/components/forms/inspecciones/DeriveMaintenanceModal";
import { useParams } from 'next/navigation';
import {
    Check,
    Pencil,
    Trash2,
    Plus,
    ArrowLeft,
    CornerUpRight
} from "lucide-react";
import Link from 'next/link';
import { useInspeccionDetalle } from '@/hooks/inspecciones/useInspecciones';
import { toast } from 'sonner';

export default function InspeccionDetalle() {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deriveModalOpen, setDeriveModalOpen] = useState(false);

    // Obtener el ID de la URL
    const params = useParams();
    const id = parseInt(params.id as string);

    // Usar el hook para obtener datos del mantenimiento
    const { data, isLoading, error } = useInspeccionDetalle(id);

    if (isLoading) {
        return (
            <div> Cargando inspección...</div>
        )
    }

    console.log(data);

    return (
        <div className="p-8 space-y-6  min-h-screen">
            {/* Top Navigation / Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/calendario" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{data?.titulo}</h1>
                        <p className="text-slate-500 font-medium">{data?.codigoVerificacion}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        className="bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-900 gap-2 font-medium" // Yellow for Derivar
                        onClick={() => setDeriveModalOpen(true)}
                    >
                        <CornerUpRight className="w-4 h-4" />
                        Derivar Mantenimiento
                    </Button>
                    <Button
                        className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white gap-2" // Blue for Edit
                        onClick={() => setEditModalOpen(true)}
                    >
                        <Pencil className="w-4 h-4" />
                        Editar
                    </Button>
                    <Button
                        variant="destructive"
                        className="bg-[#EF4444] hover:bg-[#DC2626] gap-2" // Red for Delete
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        Eliminar
                    </Button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">

                {/* Status & Supervisor Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full md:w-2/3">
                    {/* Estado */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Estado</h3>
                        <div className="flex items-center gap-2 px-4 py-2 bg-sky-300 text-slate-900 rounded-md border border-sky-400 w-fit font-medium">
                            <Check className="w-4 h-4" />
                            {data?.estado}
                        </div>
                    </div>

                    {/* Supervisor */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Supervisor</h3>
                        <div className="p-2 bg-slate-200/50 rounded-md border border-slate-300 font-medium text-slate-700 min-w-[200px]">
                            {data.supervisor}
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100 my-8" />

                {/* Observacion */}
                <div className="mb-8">
                    <h3 className="font-bold text-lg mb-3">Observación</h3>
                    <div className="p-4 border border-slate-300 rounded-lg text-slate-700 min-h-[60px]">
                        {data?.observacion}
                    </div>
                </div>

                <hr className="border-slate-100 my-8" />

                {/* Location & Specs Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Ubicación técnica</h3>
                        <div className="p-4 bg-slate-200/50 rounded-lg border border-slate-300 min-h-[80px]">
                            <p className="font-semibold">{data?.ubicacion}</p>
                            <p className="text-sm text-slate-600">{data.abreviacion}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Área encargada</h3>
                        <div className="p-4 bg-slate-200/50 rounded-lg border border-slate-300 min-h-[80px]">
                            <p className=" font-semibold">{data?.areaEncargada}</p>
                            <p className="text-slate-700">{data?.codigoArea}</p>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100 my-8" />

                {/* Programacion */}
                <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4">Programación de Inspección</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <span className="font-bold">Fecha de creación</span>
                            <div className="p-3 border border-slate-300 rounded-md text-slate-700 font-medium">
                                {data?.fechaCreacion}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="font-bold">Frecuencia</span>
                            <div className="p-3 border border-slate-300 rounded-md text-slate-700 font-medium">
                                {data?.frecuencia}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100 my-8" />

                {/* Actividades */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Actividades</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Checklist Item */}
                        {data.checklist && (
                            <div className="flex items-center justify-between p-3 border border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
                                <Link
                                    href={`/detalle-trabajo?id=${id}&type=inspecciones`}
                                    className="flex-1 hover:underline cursor-pointer"
                                >
                                    <span className="font-medium text-slate-900">{data.tituloChecklist}</span>
                                </Link>

                            </div>
                        )}

                        {/* Add Button */}
                        <Button variant="outline" className="w-full h-full min-h-[50px] border-dashed border-2 text-slate-600 hover:text-slate-900 hover:border-slate-400">
                            <Plus className="w-5 h-5 mr-2" />
                            Agregar Checklist
                        </Button>
                    </div>
                </div>

            </div>

            {/* Derive Maintenance Modal */}
            <DeriveMaintenanceModal
                open={deriveModalOpen}
                onClose={() => setDeriveModalOpen(false)}
                onConfirm={(name) => { alert(`Derivado a: ${name}`); setDeriveModalOpen(false); }}
            />

            {/* Edit Modal */}
            <EditInspectionModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onConfirm={() => { alert('Editando...'); setEditModalOpen(false); }}
                inspectionName={"fata"}
            />

            {/* Delete Modal */}
            <DeleteInspectionModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => { toast.success("Inspección eliminada con éxito"); setDeleteModalOpen(false); }}
                inspectionName={data.titulo}
                idInspeccion={data.idInspeccion}
            />
        </div>
    );
}
