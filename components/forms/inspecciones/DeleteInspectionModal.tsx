import React from 'react';
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface DeleteInspectionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    inspectionName: string;
}

export const DeleteInspectionModal: React.FC<DeleteInspectionModalProps> = ({ open, onClose, onConfirm, inspectionName }) => {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Eliminar Inspección</span>}
            className="bg-white max-w-md"
        >
            <div className="py-6 text-center">
                <p className="text-gray-600">
                    ¿Estás seguro que deseas eliminar la inspección <strong className="text-gray-900">{inspectionName}</strong>?
                    Esta acción no se puede deshacer.
                </p>
            </div>

            <div className="flex justify-end gap-4 mt-2">
                <Button variant="outline" onClick={onClose} className="min-w-[100px]">
                    Cancelar
                </Button>
                <Button
                    className="bg-red-600 hover:bg-red-700 text-white min-w-[100px]"
                    onClick={onConfirm}
                >
                    Eliminar
                </Button>
            </div>
        </Modal>
    );
};
