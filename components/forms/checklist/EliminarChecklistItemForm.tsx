'use client';

import type { Actividad } from "@/types/checklist.types";  
import { useEliminarChecklistItem } from "@/hooks/checklist/useDeleteChecklistItem";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EliminarChecklistItemProps {
    actividad: Actividad | null;
    setActividad: (actividad: Actividad | null) => void;
    onDelete: (id: number) => void;
    checklistId: number;
}

const EliminarChecklistItem: React.FC<EliminarChecklistItemProps> = ({
    actividad,
    setActividad,
    onDelete,
    checklistId
}) => {
    const deleteGrupoMutation = useEliminarChecklistItem();

    const handleDelete = () => {
        if (!actividad) return;
        deleteGrupoMutation.mutate({
            checklistId: checklistId, // ID del padre
            itemId: actividad.id      // ID del hijo
        }, {
            onSuccess: () => {
                if (onDelete) onDelete(actividad.id);
                setActividad(null); // Cerrar el modal
            }
        });
    };

    return (
        <Dialog open={actividad !== null} onOpenChange={(open) => {
            if (!open) setActividad(null);
            }}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Eliminar Actividad</DialogTitle>
                </DialogHeader>
                <div className="p-6">
                <p className="mb-4">
                    ¿Estás seguro de que deseas eliminar la actividad{" "}
                    <strong>{actividad?.nombre}</strong>? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end space-x-3">
                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActividad(null)}
                    disabled={deleteGrupoMutation.isPending}
                    >
                    Cancelar
                    </Button>
                    <Button
                    type="button"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleDelete}
                    disabled={deleteGrupoMutation.isPending}
                    >
                    {deleteGrupoMutation.isPending ? "Eliminando..." : "Eliminar"}
                    </Button>
                </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export { EliminarChecklistItem };