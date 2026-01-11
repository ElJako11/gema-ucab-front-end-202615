import React from 'react';
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useDeleteInsepccion } from '@/hooks/inspecciones/useDeleteInspeccion';
import { useRouter } from 'next/navigation';

interface DeleteInspectionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    inspectionName: string;
    idInspeccion: number;
}

export const DeleteInspectionModal: React.FC<DeleteInspectionModalProps> = ({ open, onClose, onConfirm, inspectionName, idInspeccion }) => {


    const router = useRouter();
    const { mutate: deleteInspection, isPending } = useDeleteInsepccion(idInspeccion);

    const handleConfirmDelete = () => {

        deleteInspection(idInspeccion, {
            onSuccess: () => {
                onClose(); // cerrar el modal 
                onConfirm();
                router.push("/calendario?deletedInspection=true")
            }
        })
    }



    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Eliminar Inspección</span>}
            description={<>
                ¿Estás seguro que deseas eliminar la inspección <strong className="text-gray-900">{inspectionName}</strong>? Esta acción no se puede deshacer.
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
