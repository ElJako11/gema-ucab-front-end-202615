import React from 'react';
import Link from 'next/link';
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useResumenInspection } from '@/hooks/inspecciones/useResumenInspection';

interface InspectionSummaryModalProps {
    open: boolean;
    onClose: () => void;
    data?: any;
    inspeccionId: number; // ID del mantenimiento para el enlace
}

export const InspectionSummaryModal: React.FC<InspectionSummaryModalProps> = ({ open, onClose, data, inspeccionId }) => {

    const { data: resumen, isLoading, error } = useResumenInspection(inspeccionId);

    if (isLoading) {
        return <div>Cargando...</div>
    }

    console.log(resumen);
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Resumen de Inspección</span>}
            className="bg-white max-w-4xl"
        >
            <div className="space-y-6 py-4">

                {/* Section 1: General Info - 4 boxes */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Información General</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Estado</span>
                            <span className="font-semibold">{resumen?.estado || 'Realizado'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Supervisor</span>
                            <span className="font-semibold">{resumen?.supervisor || 'Juan Pérez'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Área</span>
                            <span className="font-semibold">{resumen?.areaEncargada || 'Mantenimiento General'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Frecuencia</span>
                            <span className="font-semibold">{resumen?.frecuencia || 'Semanal'}</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Technical Location */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Ubicación Técnica</h3>
                    <div className="bg-slate-50 p-4 rounded-md border">
                        <p className="text-sm">{resumen?.ubicacion || '...'}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancelar</Button>
                <Link href={`/calendario/inspecciones/${inspeccionId}`} className="w-full sm:w-auto block">
                    <Button variant="outline" className="w-full border-gema-green text-gema-green hover:bg-gema-green/10">
                        Ver detalle de inspección
                    </Button>
                </Link>
            </div>
        </Modal>
    );
};
