import React from 'react';
import { Modal } from "@/components/ui/modal";
import { EditarMantenimientoFormContent } from './EditarMantenmientoContent';
import type { Mantenimiento } from "@/types/mantenimientos.types";


interface EditMaintenanceModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    data:Mantenimiento,
    mantenimientoId: number,
}

export const EditMaintenanceModal: React.FC<EditMaintenanceModalProps> = ({ open, onClose, data,mantenimientoId }) => {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Editar Mantenimiento</span>}
            className="bg-white max-w-4xl" // Expanded width for the form
            contentClassName="pt-6"
        >
            <EditarMantenimientoFormContent initialValues={data} onClose={onClose} mantenimientoId={mantenimientoId}/>
        </Modal>
    );
};
