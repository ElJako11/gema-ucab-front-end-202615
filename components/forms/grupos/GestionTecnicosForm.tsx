'use client';

import { useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addTecnicoToGrupo, deleteTecnicoFromGrupo } from "@/services/gruposTrabajo";

interface GestionTecnicosFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grupoTrabajo: any; 
  tecnicosDisponibles: any[];
  trabajadoresPorGrupo: Record<number, any[]>;
}

export const GestionTecnicosForm: React.FC<GestionTecnicosFormProps> = ({
  open,
  onOpenChange,
  grupoTrabajo,
  tecnicosDisponibles,
  trabajadoresPorGrupo,
}) => {
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const addTecnicoMutation = useMutation({
    mutationFn: addTecnicoToGrupo,
    onSuccess: () => {
      setTecnicoSeleccionado(null);
      toast.success("Técnico agregado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["trabajadoresPorGrupo"] });
    },
    onError: (error: Error) => {
      console.error("Error al agregar técnico:", error.message);
      toast.error("Error al agregar técnico");
    },
  });

  const handleAddTecnico = () => {
    if (!grupoTrabajo || !tecnicoSeleccionado) return;
    addTecnicoMutation.mutate({
      tecnicoId: Number(tecnicoSeleccionado),
      grupoDeTrabajoId: grupoTrabajo.id,
    });
  };

  const removeTecnicoMutation = useMutation({
    mutationFn: deleteTecnicoFromGrupo,
    onSuccess: () => {
      toast.success("Técnico eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["trabajadoresPorGrupo"] });
    },
    onError: (error: Error) => {
      console.error("Error al eliminar técnico:", error.message);
      toast.error("Error al eliminar técnico");
    },
  });

  const handleRemoveTecnico = (tecnicoId: number) => {
    if (!grupoTrabajo) return;
    removeTecnicoMutation.mutate({
      tecnicoId,
      grupoDeTrabajoId: grupoTrabajo.id,
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
              <Select
                value={tecnicoSeleccionado || ""}
                onValueChange={setTecnicoSeleccionado}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un técnico" />
                </SelectTrigger>
                <SelectContent>
                  {tecnicosDisponibles
                    .filter(
                      (tec) =>
                        !trabajadoresPorGrupo[grupoTrabajo.id]?.some(
                          (t) => t.Id === tec.Id
                        )
                    )
                    .map((tec) => (
                      <SelectItem key={tec.Id} value={String(tec.Id)}>
                        {tec.Nombre} ({tec.Correo})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <div className="flex justify-end mt-2">
                <Button
                  className="bg-gema-green/80 hover:bg-gema-green"
                  onClick={handleAddTecnico}
                  disabled={!tecnicoSeleccionado || addTecnicoMutation.isPending}
                  type="button"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {addTecnicoMutation.isPending ? "Agregando..." : "Agregar Técnico"}
                </Button>
              </div>
            </div>

            {/* Lista de técnicos */}
            <div className="border rounded-lg divide-y">
              {trabajadoresPorGrupo[grupoTrabajo.id]?.length ? (
                trabajadoresPorGrupo[grupoTrabajo.id].map((tecnico) => (
                  <div
                    key={tecnico.Id}
                    className="p-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{tecnico.Nombre}</p>
                      <p className="text-sm text-gray-600">{tecnico.Correo}</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveTecnico(tecnico.Id)}
                      disabled={removeTecnicoMutation.isPending}
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