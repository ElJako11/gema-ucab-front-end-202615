'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Assuming we have a Badge component, or I'll style spans
import { EditMaintenanceModal } from "@/components/forms/mantenimientos/EditMaintenanceModal";
import { DeleteMaintenanceModal } from "@/components/forms/mantenimientos/DeleteMaintenanceModal";
import {
    Clock,
    AlertCircle,
    Wrench,
    RotateCcw, // For 'Reabierto' icon similar to the image
    Pencil,
    Trash2,
    Plus,
    CheckSquare,
    ArrowLeft
} from "lucide-react";
import Link from 'next/link';

export default function MantenimientoDetalle() {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Mock data matching the image
    const maintenanceData = {
        title: 'Mantenimiento de aire acondicionado',
        code: 'M1-01P43',
        estado: 'En Progreso',
        prioridad: 'Alta prioridad',
        tipo: 'Periódico',
        instancia: 'Reabierto',
        resumen: 'El aire del salon 4 se daño luego de un día de uso donde tiraba agua',
        ubicacion: 'M1-P01\nMódulo 1 Piso 1',
        especificacion: 'Marca: Hyunday',
        area: 'Electricidad',
        fechaCreacion: 'Lunes 3 de Noviembre de 2025',
        fechaLimite: 'Lunes 10 de Noviembre de 2025'
    };

    return (
        <div className="p-8 space-y-6 min-h-screen">
            {/* Top Navigation / Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/MockCalendar" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{maintenanceData.title}</h1>
                        <p className="text-slate-500 font-medium">{maintenanceData.code}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white gap-2" // Custom blue from image
                        onClick={() => setEditModalOpen(true)}
                    >
                        <Pencil className="w-4 h-4" />
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
                            {maintenanceData.estado}
                        </div>
                    </div>

                    {/* Prioridad */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Prioridad</h3>
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md border border-red-200 w-fit font-medium">
                            <AlertCircle className="w-5 h-5" />
                            {maintenanceData.prioridad}
                        </div>
                    </div>

                    {/* Tipo */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Tipo</h3>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-md border border-slate-300 w-fit font-medium">
                            <Wrench className="w-5 h-5" />
                            {maintenanceData.tipo}
                        </div>
                    </div>

                    {/* Instancia */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Instancia</h3>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-md border border-slate-300 w-fit font-medium shadow-sm">
                            <RotateCcw className="w-5 h-5" />
                            {maintenanceData.instancia}
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100 my-8" />

                {/* Resumen */}
                <div className="mb-8">
                    <h3 className="font-bold text-lg mb-3">Resumen</h3>
                    <div className="p-4 border border-slate-300 rounded-lg text-slate-700">
                        {maintenanceData.resumen}
                    </div>
                </div>

                <hr className="border-slate-100 my-8" />

                {/* Location & Specs Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Ubicación técnica</h3>
                        <div className="p-4 bg-slate-200/50 rounded-lg border border-slate-300 min-h-[80px]">
                            <p className="font-semibold">{maintenanceData.ubicacion.split('\n')[0]}</p>
                            <p className="text-sm text-slate-600">{maintenanceData.ubicacion.split('\n')[1]}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Especificación del dispositivo</h3>
                        <div className="p-4 bg-slate-200/50 rounded-lg border border-slate-300 min-h-[80px]">
                            <p className="text-slate-700">{maintenanceData.especificacion}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Área encargada</h3>
                        <div className="p-4 bg-slate-200/50 rounded-lg border border-slate-300 min-h-[80px]">
                            <p className="text-slate-700">{maintenanceData.area}</p>
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
                                {maintenanceData.fechaCreacion}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="font-bold">Fecha límite</span>
                            <div className="p-3 border border-slate-300 rounded-md text-slate-700 font-medium">
                                {maintenanceData.fechaLimite}
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
                        <div className="flex items-center justify-between p-3 border border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
                            <span className="font-medium text-slate-900">Checklist de revisión</span>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Add Button */}
                        <Button variant="outline" className="w-full h-full min-h-[50px] border-dashed border-2 text-slate-600 hover:text-slate-900 hover:border-slate-400">
                            <Plus className="w-5 h-5 mr-2" />
                            Agregar Checklist
                        </Button>
                    </div>
                </div>

            </div>

            {/* Edit Modal */}
            <EditMaintenanceModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                data={maintenanceData}
            />

            {/* Delete Modal */}
            <DeleteMaintenanceModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => { alert('Eliminado'); setDeleteModalOpen(false); }}
                maintenanceName={maintenanceData.title}
            />
        </div>
    );
}
