'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteGrupo } from "@/hooks/grupos-trabajo/useDeleteGrupo";
import type { GrupoTrabajo } from "@/types/grupostrabajo.types";

export interface EliminarGrupoFormProps {
  grupo: GrupoTrabajo | null;
  setGrupo: (grupo: GrupoTrabajo | null) => void;
}

export const EliminarGrupoForm: React.FC<EliminarGrupoFormProps> = ({
  grupo,
  setGrupo,
}) => {
  const deleteGrupoMutation = useDeleteGrupo();

  const handleDelete = () => {
    if (!grupo) return;
    deleteGrupoMutation.mutate(grupo.id, {
      onSuccess: () => {
        setGrupo(null);
      }
    });
  };

  return (
    <Dialog open={grupo !== null} onOpenChange={(open) => {
      if (!open) setGrupo(null);
    }}>
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
              onClick={() => setGrupo(null)}
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