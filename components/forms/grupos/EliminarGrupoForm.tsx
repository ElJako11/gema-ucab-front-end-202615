'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
      <DialogContent contentClassName="pt-6">
        <DialogHeader className="pb-2">
          <DialogTitle>Eliminar Grupo</DialogTitle>
          <DialogDescription className="pb-6">
            ¿Estás seguro de que deseas eliminar el grupo <strong>{grupo?.nombre}</strong>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 pt-4">
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
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteGrupoMutation.isPending}
          >
            {deleteGrupoMutation.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};