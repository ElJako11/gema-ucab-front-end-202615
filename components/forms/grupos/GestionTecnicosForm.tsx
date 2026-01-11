'use client';

import { useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";

// ✅ Usar hooks organizados
import { useCreateAsignacion } from "@/hooks/asignacion-grupos/useCreateAsignacion";
import { useDeleteAsignacionByTecnicoGrupo } from "@/hooks/asignacion-grupos/useDeleteAsignacion";
import { useTecnicos } from "@/hooks/tecnicos/useTecnicos";

interface GestionTecnicosFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grupoTrabajo: any; 
  trabajadoresPorGrupo: Record<number, any[]>;
}

export const GestionTecnicosForm: React.FC<GestionTecnicosFormProps> = ({
  open,
  onOpenChange,
  grupoTrabajo,
  trabajadoresPorGrupo,
}) => {
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<number | null>(null);

  // ✅ Usar hooks organizados
  const createAsignacionMutation = useCreateAsignacion();
  const deleteAsignacionMutation = useDeleteAsignacionByTecnicoGrupo();
  const { tecnicos: tecnicosDisponibles, isLoading: isLoadingTecnicos } = useTecnicos();

  const handleAddTecnico = () => {
    if (!grupoTrabajo || !tecnicoSeleccionado) return;
    
    createAsignacionMutation.mutate({
      tecnicoId: tecnicoSeleccionado,
      grupoDeTrabajoId: grupoTrabajo.id,
    }, {
      onSuccess: () => {
        setTecnicoSeleccionado(null);
      }
    });
  };

  const handleRemoveTecnico = (tecnicoId: number) => {
    if (!grupoTrabajo) return;
    
    deleteAsignacionMutation.mutate({
      tecnicoId,
      grupoId: grupoTrabajo.id
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Técnicos del Grupo {grupoTrabajo?.codigo}
          </DialogTitle>
        </DialogHeader>

        {grupoTrabajo && (
          <div className="space-y-4 mt-3">
            {/* Formulario para agregar técnico */}
            <div className="mb-6 space-y-2">
              <Label htmlFor="tecnico">Agregar Técnico</Label>
              <Combobox
                data={(tecnicosDisponibles || [])
                  .filter(
                    (tec) =>
                      !trabajadoresPorGrupo[grupoTrabajo.id]?.some(
                        (t) => t.idTecnico === tec.idTecnico
                      )
                  )
                  .map((tecnico) => ({
                    value: tecnico.idTecnico,
                    label: `${tecnico.nombre ?? 'Sin nombre'} (${tecnico.correo ?? 'Sin correo'})`,
                  }))}
                value={tecnicoSeleccionado}
                onValueChange={(value) => setTecnicoSeleccionado(value as number | null)}
                placeholder={isLoadingTecnicos ? "Cargando técnicos..." : "Seleccione un técnico"}
                searchPlaceholder="Buscar técnico..."
                triggerClassName="w-full"
                contentClassName="w-full"
              />

              <div className="flex justify-end mt-2">
                <Button
                  className="bg-gema-green/80 hover:bg-gema-green"
                  onClick={handleAddTecnico}
                  disabled={!tecnicoSeleccionado || createAsignacionMutation.isPending}
                  type="button"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {createAsignacionMutation.isPending ? "Agregando..." : "Agregar Técnico"}
                </Button>
              </div>
            </div>

            {/* Lista de técnicos */}
            <div className="border border-border rounded-lg divide-y">
              {trabajadoresPorGrupo[grupoTrabajo.id]?.length ? (
                trabajadoresPorGrupo[grupoTrabajo.id].map((tecnico) => (
                  <div
                    key={tecnico.idTecnico}
                    className="p-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{tecnico.nombre}</p>
                      <p className="text-sm text-gray-600">{tecnico.correo ?? 'Sin correo'}</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveTecnico(tecnico.idTecnico)}
                      disabled={deleteAsignacionMutation.isPending}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="p-4 text-gray-500 text-center">
                  No hay técnicos en este grupo
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};