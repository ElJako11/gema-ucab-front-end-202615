import React from 'react';
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useDeleteMantenimiento } from '@/hooks/mantenimientos/useDeleteMantenimiento';
import { useRouter } from 'next/navigation';

interface DeleteMaintenanceModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    maintenanceName: string;
    maintenanceId: number;
}

export const DeleteMaintenanceModal: React.FC<DeleteMaintenanceModalProps> = ({
    open,
    onClose,
    onConfirm,
    maintenanceName,
    maintenanceId
}) => {

    const router = useRouter();

    const { mutate: deleteMantenimiento, isPending } = useDeleteMantenimiento(maintenanceId);

    const handleConfirmDelete = () => {
        //ejecutar la mutación pasando el ID 

        deleteMantenimiento(maintenanceId, {
            onSuccess: () => {
                onClose(); //cerrar el modal 
                onConfirm();
                router.push("/calendario?deleted=true");
            }
        });
    }
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Eliminar Mantenimiento</span>}
            description={<>
                ¿Estás seguro que deseas eliminar el mantenimiento <strong className="text-gray-900">{maintenanceName}</strong>? Esta acción no se puede deshacer.
            </>}
            className="bg-white max-w-md"
            contentClassName="pt-6"
        >
            <div className="flex justify-end gap-4 pt-4">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="min-w-[100px]"
                >
                    Cancelar
                </Button>
                <Button
                    variant="destructive"
                    className="min-w-[100px]"
                    onClick={handleConfirmDelete}
                    disabled={isPending}
                >
                    {isPending ? "Eliminando..." : "Eliminar"}
                </Button>
            </div>
        </Modal>
    );
};
