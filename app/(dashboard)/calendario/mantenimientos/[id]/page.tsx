'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { EditMaintenanceModal } from "@/components/forms/mantenimientos/EditMaintenanceModal";
import { DeleteMaintenanceModal } from "@/components/forms/mantenimientos/DeleteMaintenanceModal";
import { useMantenimientoDetalle } from "@/hooks/mantenimientos/useMantenimiento";
import { useGetAllChecklistItem } from "@/hooks/checklist/useGetAllChecklistItem";
import { AgregarChecklistForm } from "@/components/forms/checklist/AgregarChecklistForm";
import { EditarChecklistForm } from "@/components/forms/checklist/EditarChecklistForm";
import { DeleteChecklistModal } from "@/components/forms/checklist/DeleteChecklistModal";
import {
    Clock,
    AlertCircle,
    Wrench,
    RotateCcw, // For 'Reabierto' icon similar to the image
    ClipboardPen,
    Trash2,
    Plus,
    ArrowLeft
} from "lucide-react";
import Link from 'next/link';
import { toast } from 'sonner';

export default function MantenimientoDetalle() {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addChecklistModalOpen, setAddChecklistModalOpen] = useState(false);
    const [editChecklistModalOpen, setEditChecklistModalOpen] = useState(false);
    const [deleteChecklistModalOpen, setDeleteChecklistModalOpen] = useState(false);

    // Obtener el ID de la URL
    const params = useParams();
    const id = parseInt(params.id as string);

    // Usar el hook para obtener datos del mantenimiento
    const { data: maintenanceData, isLoading, error } = useMantenimientoDetalle(id);

    // Obtener datos del checklist
    // Solo intentar buscar checklist si el mantenimiento tiene uno asociado
    const { data: checklistData } = useGetAllChecklistItem("mantenimientos", id, {
        enabled: !!maintenanceData
    });

    // Estados de carga y error
    if (isLoading) return <div className="p-8">Cargando mantenimiento...</div>;
    if (error) return <div className="p-8">Error: {error.message}</div>;
    if (!maintenanceData) return <div className="p-8">Mantenimiento no encontrado</div>;

    // Usar datos reales cuando estén disponibles, sino mock data
    const data = maintenanceData;

    console.log("Maintenance Data:", data);
    console.log("Checklist Data:", checklistData);

    const checklistId = checklistData?.id || data.idChecklist;
    const checklistTitle = data.tituloChecklist;

    return (
        <div className="p-8 space-y-6 min-h-screen">
            {/* Top Navigation / Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/calendario" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{data.titulo}</h1>
                        <p className="text-slate-500 font-medium">{data.codigoVerificacion}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white gap-2" // Custom blue from image
                        onClick={() => setEditModalOpen(true)}
                    >
                        <ClipboardPen className="w-4 h-4" />
                        Editar
                    </Button>
                    <Button
                        variant="destructive"
                        className="bg-[#EF4444] hover:bg-[#DC2626] gap-2" // Custom red from image
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        Eliminar
                    </Button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">

                {/* Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Estado */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Estado</h3>
                        <div className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-md border border-sky-200 w-fit font-medium">
                            <Clock className="w-5 h-5" />
                            {data.estado}
                        </div>
                    </div>

                    {/* Prioridad */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Prioridad</h3>
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md border border-red-200 w-fit font-medium">
                            <AlertCircle className="w-5 h-5" />
                            {data.prioridad}
                        </div>
                    </div>

                    {/* Tipo */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Tipo</h3>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-md border border-slate-300 w-fit font-medium">
                            <Wrench className="w-5 h-5" />
                            {data.tipo}
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100 my-8" />

                {/* Resumen */}
                <div className="mb-8">
                    <h3 className="font-bold text-lg mb-3">Resumen</h3>
                    <div className="p-4 border border-slate-300 rounded-lg text-slate-700">
                        {data.resumen || data.especificacion}
                    </div>
                </div>

                <hr className="border-slate-100 my-8" />

                {/* Location & Specs Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Ubicación técnica</h3>
                        <div className="p-4 bg-slate-200/50 rounded-lg border border-slate-300 min-h-[80px]">
                            <p className="font-semibold">{data.ubicacion.split('\n')[0]}</p>
                            <p className="text-sm text-slate-600">{data.abreviacion}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Área encargada</h3>
                        <div className="p-4 bg-slate-200/50 rounded-lg border border-slate-300 min-h-[80px]">
                            <p className="font-semibold">{data.areaEncargada}</p>
                            <p className="text-sm text-slate-600">{data.codigoArea}</p>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100 my-8" />

                {/* Programacion */}
                <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4">Programación del mantenimiento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <span className="font-bold">Fecha de creación</span>
                            <div className="p-3 border border-slate-300 rounded-md text-slate-700 font-medium">
                                {data.fechaCreacion}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="font-bold">Fecha límite</span>
                            <div className="p-3 border border-slate-300 rounded-md text-slate-700 font-medium">
                                {data.fechaLimite}
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
                        {checklistTitle ? (
                            <div className="flex items-center justify-between p-3 border border-slate-300 rounded-lg group hover:border-slate-400 transition-colors relative">
                                <Link
                                    href={`/detalle-trabajo/mantenimientos/${id}`}
                                    className="flex-1 hover:underline cursor-pointer"
                                >
                                    <span className="font-medium text-slate-900">{checklistTitle}</span>
                                </Link>
                                {checklistId && (
                                    <div className="flex z-10 relative">
                                        <div className="inline-block p-1 border-2 border-gray-200 rounded-[10px] mx-1 cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log("Opening edit modal, ID:", checklistId);
                                                setEditChecklistModalOpen(true);
                                            }}
                                        >
                                            <ClipboardPen className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div className="inline-block p-1 border-2 border-gray-200 rounded-[10px] mx-1 cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log("Opening delete modal, ID:", checklistId);
                                                setDeleteChecklistModalOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                className="w-full h-full min-h-[50px] border-dashed border-2 text-slate-600 hover:text-slate-900 hover:border-slate-400"
                                onClick={() => setAddChecklistModalOpen(true)}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Agregar Checklist
                            </Button>
                        )}
                    </div>
                </div>

            </div>

            {/* Edit Modal */}
            <EditMaintenanceModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                data={data}
            />

            {/* Delete Modal */}
            <DeleteMaintenanceModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => { toast.success("Mantenimiento eliminado con éxito"); setDeleteModalOpen(false); }}
                maintenanceName={data.titulo}
                maintenanceId={data.id}
            />

            {/* Add Checklist Modal */}
            <AgregarChecklistForm
                open={addChecklistModalOpen}
                onClose={() => setAddChecklistModalOpen(false)}
                onSuccess={(data) => {
                    setAddChecklistModalOpen(false);
                }}
                maintenanceId={id}
                type="mantenimientos"
            />

            {/* Edit Checklist Modal */}
            <EditarChecklistForm
                open={editChecklistModalOpen}
                onClose={() => setEditChecklistModalOpen(false)}
                checklistId={checklistId || 0}
                currentName={checklistTitle || ""}
            />

            <DeleteChecklistModal
                open={deleteChecklistModalOpen}
                onClose={() => setDeleteChecklistModalOpen(false)}
                checklistId={checklistId || 0}
                checklistName={checklistTitle || ""}
            />
        </div>
    );
}
