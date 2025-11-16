'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteGrupo } from "@/hooks/grupos-trabajo/useDeleteGrupo";

interface EliminarGrupoFormProps {
  grupo: any;
  onClose: () => void;
}

export const EliminarGrupoForm: React.FC<EliminarGrupoFormProps> = ({
  grupo,
  onClose,
}) => {
  const deleteGrupoMutation = useDeleteGrupo();

  const handleDelete = () => {
    if (!grupo) return;
    deleteGrupoMutation.mutate(grupo.id, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <Dialog open={grupo !== null} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Grupo</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <p className="mb-4">
            ¿Estás seguro de que deseas eliminar el grupo{" "}
            <strong>{grupo?.nombre}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
};