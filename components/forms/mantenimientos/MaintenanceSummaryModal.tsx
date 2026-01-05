import React from 'react';
import Link from 'next/link';
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface MaintenanceSummaryModalProps {
    open: boolean;
    onClose: () => void;
    data?: any; // To be typed properly later
    mantenimientoId?: number; // ID del mantenimiento para el enlace
}

export const MaintenanceSummaryModal: React.FC<MaintenanceSummaryModalProps> = ({ open, onClose, data, mantenimientoId }) => {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Resumen de Mantenimiento</span>}
            className="bg-white max-w-4xl"
        >
            <div className="space-y-6 py-4">

                {/* Section 1: Classification - 4 boxes */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Clasificación</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Estado</span>
                            <span className="font-semibold">{data?.estado || 'Programado'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Prioridad</span>
                            <span className="font-semibold">{data?.prioridad || 'Alta'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Frecuencia</span>
                            <span className="font-semibold">{data?.frecuencia || 'Mensual'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Repetición</span>
                            <span className="font-semibold">{data?.repeticion || 'Sí'}</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Technical Location */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Ubicación Técnica</h3>
                    <div className="bg-slate-50 p-4 rounded-md border">
                        <p className="text-sm">{data?.ubicacion || 'Edificio Administrativo > Piso 1 > Oficina 101'}</p>
                    </div>
                </div>

                {/* Section 3: Deadline for Maintenance */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Fecha Límite</h3>
                    <div className="bg-red-50 p-4 rounded-md border border-red-100 flex items-center gap-2">
                        <span className="text-red-700 font-semibold">{data?.fechaLimite || '15/12/2025'}</span>
                    </div>
                </div>



            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                <Link href={mantenimientoId ? `/mantenimientos/detalle/${mantenimientoId}` : "/mantenimientos/detalle"}>
                    <Button variant="outline" className="border-gema-green text-gema-green hover:bg-gema-green/10">
                        Ver detalle del mantenimiento
                    </Button>
                </Link>
            </div>
        </Modal>
    );
};
