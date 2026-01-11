'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTecnico } from "@/hooks/tecnicos/useDeleteTecnico";
import { Tecnico } from "@/types/tecnicos.types";

interface EliminarTecnicoFormProps {
    tecnico: Tecnico;
    setTecnico: (tecnico: Tecnico | null) => void;
}

export const EliminarTecnicoForm: React.FC<EliminarTecnicoFormProps> = ({
    tecnico,
    setTecnico,
}) => {
    const deleteUsuarioMutation = useDeleteTecnico();

    const handleDelete = () => {
        if (!tecnico) return;

        deleteUsuarioMutation.mutate(tecnico.idTecnico, {
            onSuccess: () => {
                setTecnico(null);
            },
            onError: (error) => {
                console.log("Error al eliminar un tecnico", error)
            }
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) setTecnico(null);
    }

    return (
        <Dialog open={!!tecnico} onOpenChange={handleOpenChange}>
            <DialogContent contentClassName="pt-6">
                <DialogHeader className="pb-2">
                    <DialogTitle>Eliminar Tecnico</DialogTitle>
                    <DialogDescription className="pb-6">
                        ¿Estás seguro que deseas eliminar al tecnico <strong>{tecnico?.nombre}</strong>? Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setTecnico(null)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteUsuarioMutation.isPending}
                    >
                        {deleteUsuarioMutation.isPending ? "Eliminando..." : "Eliminar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
