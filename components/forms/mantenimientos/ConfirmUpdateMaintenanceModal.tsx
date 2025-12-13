import React from 'react';
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ConfirmUpdateMaintenanceModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    maintenanceName: string;
}

export const ConfirmUpdateMaintenanceModal: React.FC<ConfirmUpdateMaintenanceModalProps> = ({ open, onClose, onConfirm, maintenanceName }) => {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Confirmar Modificación</span>}
            className="bg-white max-w-md"
        >
            <div className="py-6 text-center">
                <p className="text-gray-600">
                    ¿Estás seguro que deseas modificar el mantenimiento <strong className="text-gray-900">{maintenanceName}</strong>?
                    Esta acción no se puede deshacer.
                </p>
            </div>

            <div className="flex justify-end gap-4 mt-2">
                <Button variant="outline" onClick={onClose} className="min-w-[100px]">
                    Cancelar
                </Button>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
                    onClick={onConfirm}
                >
                    Editar
                </Button>
            </div>
        </Modal>
    );
};
