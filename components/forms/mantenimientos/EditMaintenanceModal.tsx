import React from 'react';
import { Modal } from "@/components/ui/modal";
import { MaintenanceFormContent } from './MaintenanceFormContent';

interface EditMaintenanceModalProps {
    open: boolean;
    onClose: () => void;
    // We can accept onConfirm if we want the external page to handle the submit, 
    // but the form content has its own save button styling. 
    // For now, let's just make it render the content.
    onConfirm?: () => void;
    maintenanceName?: string; // Optional now as we show full form
    data?: any; // The data to populate the form
}

export const EditMaintenanceModal: React.FC<EditMaintenanceModalProps> = ({ open, onClose, data }) => {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Editar Mantenimiento</span>}
            className="bg-white max-w-4xl" // Expanded width for the form
        >
            <MaintenanceFormContent initialValues={data} onClose={onClose} />
        </Modal>
    );
};
