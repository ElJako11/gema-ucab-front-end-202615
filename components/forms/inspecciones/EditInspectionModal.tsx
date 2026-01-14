import React from 'react';
import { Modal } from "@/components/ui/modal";
import { InspectionFormContent } from './EditInspectionContent';
import { Inspeccion } from '@/types/inspecciones.types';

interface EditInspectionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    inspectionName?: string;
    data: Inspeccion;
}

export const EditInspectionModal: React.FC<EditInspectionModalProps> = ({ open, onClose, data }) => {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Editar Inspección</span>}
            className="bg-white max-w-4xl"
            contentClassName="pt-6"
        >
            <InspectionFormContent initialData={data} onClose={onClose} />
        </Modal>
    );
};
