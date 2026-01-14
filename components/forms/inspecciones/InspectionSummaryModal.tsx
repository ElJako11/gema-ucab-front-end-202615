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

export const InspectionSummaryModal: React.FC<InspectionSummaryModalProps> = ({ open, onClose, inspeccionId }) => {

    const { data, isLoading, error } = useResumenInspection(inspeccionId);

    if (isLoading) {
        return <div>Cargando...</div>
    }

    const resumen = (data && data.length > 0) ? data[0] : null;


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
                            <span className="block text-sm text-gray-500">Supervisor</span>
                            <span className="font-semibold">{resumen?.supervisor || '...'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Área</span>
                            <span className="font-semibold">{resumen?.areaEncargada || '...'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Frecuencia</span>
                            <span className="font-semibold">{resumen?.frecuencia || '...'}</span>
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


            <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Link href={`/calendario/inspecciones/${inspeccionId}`}>
                    <Button variant="outline" className="border-gema-green text-gema-green hover:bg-gema-green/10">

                        Ver detalle de inspección
                    </Button>
                </Link>
            </div>
        </Modal>
    );
};
