import React from 'react';
import Link from 'next/link';
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface InspectionSummaryModalProps {
    open: boolean;
    onClose: () => void;
    data?: any;
}

export const InspectionSummaryModal: React.FC<InspectionSummaryModalProps> = ({ open, onClose, data }) => {
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
                            <span className="font-semibold">{data?.estado || 'Realizado'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Supervisor</span>
                            <span className="font-semibold">{data?.supervisor || 'Juan Pérez'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Área</span>
                            <span className="font-semibold">{data?.area || 'Mantenimiento General'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border text-center">
                            <span className="block text-sm text-gray-500">Frecuencia</span>
                            <span className="font-semibold">{data?.frecuencia || 'Semanal'}</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Technical Location */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Ubicación Técnica</h3>
                    <div className="bg-slate-50 p-4 rounded-md border">
                        <p className="text-sm">{data?.ubicacion || 'Planta Baja > Baños'}</p>
                    </div>
                </div>

                {/* Section 3: Observation */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Observación</h3>
                    <div className="bg-slate-50 p-4 rounded-md border hover:bg-slate-100 transition-colors">
                        <p className="text-sm">{data?.observacion || 'Sin observaciones registradas.'}</p>
                    </div>
                </div>

            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                <Link href="/inspecciones/detalle">
                    <Button variant="outline" className="border-gema-green text-gema-green hover:bg-gema-green/10">
                        Ver detalle de inspección
                    </Button>
                </Link>
            </div>
        </Modal>
    );
};
