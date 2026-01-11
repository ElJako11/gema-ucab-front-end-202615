'use client';

import type { Actividad } from "@/types/checklist.types";
import { useEliminarChecklistItem } from "@/hooks/checklist/useDeleteChecklistItem";
import { useDeletePlantillaItem } from "@/hooks/plantillas/useDeletePlantillaItem";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EliminarChecklistItemProps {
    actividad: Actividad | null;
    setActividad: (actividad: Actividad | null) => void;
    onDelete: (id: number) => void;
    checklistId: number;
    isTemplate?: boolean;
}

const EliminarChecklistItem: React.FC<EliminarChecklistItemProps> = ({
    actividad,
    setActividad,
    onDelete,
    checklistId,
    isTemplate = false
}) => {
    const deleteChecklistMutation = useEliminarChecklistItem();
    const deletePlantillaMutation = useDeletePlantillaItem();

    // Determinar qué mutación usar
    const isPending = isTemplate ? deletePlantillaMutation.isPending : deleteChecklistMutation.isPending;

    const handleDelete = () => {
        if (!actividad) return;

        if (isTemplate) {
            deletePlantillaMutation.mutate({
                plantillaId: checklistId,
                itemId: actividad.id
            }, {
                onSuccess: () => {
                    if (onDelete) onDelete(actividad.id);
                    setActividad(null);
                }
            });
        } else {
            deleteChecklistMutation.mutate({
                checklistId: checklistId,
                itemId: actividad.id
            }, {
                onSuccess: () => {
                    if (onDelete) onDelete(actividad.id);
                    setActividad(null);
                }
            });
        }
    };

    return (
        <Dialog open={actividad !== null} onOpenChange={(open) => {
            if (!open) setActividad(null);
        }}>
            <DialogContent contentClassName="pt-6">
                <DialogHeader className="pb-2">
                    <DialogTitle>Eliminar Actividad</DialogTitle>
                    <DialogDescription className="pb-6">
                        ¿Estás seguro de que deseas eliminar la actividad <strong>{actividad?.nombre}</strong>? Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActividad(null)}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? "Eliminando..." : "Eliminar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export { EliminarChecklistItem };