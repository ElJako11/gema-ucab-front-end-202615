import React from 'react';
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useDeleteChecklist } from '@/hooks/checklist/useDeleteChecklist';

interface DeleteChecklistModalProps {
    open: boolean;
    onClose: () => void;
    checklistId: number;
    checklistName: string;
}

export const DeleteChecklistModal: React.FC<DeleteChecklistModalProps> = ({
    open,
    onClose,
    checklistId,
    checklistName
}) => {
    const { mutate: deleteChecklist, isPending } = useDeleteChecklist();

    const handleConfirmDelete = () => {
        console.log("handleConfirmDelete called with ID:", checklistId);
        deleteChecklist(checklistId, {
            onSuccess: () => {
                console.log("Delete success");
                onClose();
            },
            onError: (error) => {
                console.error("Delete error:", error);
            }
        });
    }

    console.log("DeleteChecklistModal render. Open:", open, "ID:", checklistId);

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Eliminar Checklist</span>}
            className="bg-white max-w-md"
        >
            <div className="py-6 text-center">
                <p className="text-gray-600">
                    ¿Estás seguro que deseas eliminar el checklist <strong className="text-gray-900">{checklistName}</strong>?
                    Esta acción no se puede deshacer.
                </p>
            </div>

            <div className="flex justify-end gap-4 mt-2">
                <Button variant="outline" onClick={onClose} className="min-w-[100px]">
                    Cancelar
                </Button>
                <Button
                    className="bg-red-600 hover:bg-red-700 text-white min-w-[100px]"
                    onClick={handleConfirmDelete}
                    disabled={isPending}
                >
                    {isPending ? "Eliminando..." : "Eliminar"}
                </Button>
            </div>
        </Modal>
    );
};
