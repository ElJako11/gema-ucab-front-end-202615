'use client';

import { useState } from "react";
import { UserCheck, CirclePlus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGruposTrabajo } from "@/hooks/grupos-trabajo/useGrupoTrabajo";
import { useTecnicos } from "@/hooks/grupos-trabajo/useTecnicos";
import { useTrabajadoresPorGrupo } from "@/hooks/grupos-trabajo/useTrabajadoresPorGrupo";
import { CreateGrupoForm } from "@/components/forms/grupos/CreateGrupoForm";
import { EditGrupoForm } from "@/components/forms/grupos/EditGrupoForm";
import { EliminarGrupoForm } from "@/components/forms/grupos/EliminarGrupoForm";
import { GestionTecnicosForm } from "@/components/forms/grupos/GestionTecnicosForm";
import { GruposTable } from "@/components/GrupoDeTrabajo/tables/gruposTable";
import { GruposCards } from "@/components/GrupoDeTrabajo/cards/GruposCards";

const GruposTrabajo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTecnicosModalOpen, setIsTecnicosModalOpen] = useState(false);
  const [selectedGrupoId, setSelectedGrupoId] = useState<number | null>(null);
  const [grupoEditar, setGrupoEditar] = useState<any>(null);
  const [grupoEliminar, setGrupoEliminar] = useState<any>(null);

  const { grupos, isLoading: gruposLoading } = useGruposTrabajo();
  const { tecnicos, isLoading: tecnicosLoading } = useTecnicos();
  const { trabajadoresPorGrupo, isLoading: trabajadoresLoading } = useTrabajadoresPorGrupo();

  const isLoading = gruposLoading || tecnicosLoading || trabajadoresLoading;

  const openTecnicosModal = (grupoId: number) => {
    setSelectedGrupoId(grupoId);
    setIsTecnicosModalOpen(true);
  };

  const getSupervisorNombre = (id: number | null) =>
    tecnicos?.find((s) => s.Id === id)?.Nombre || "No asignado";

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <LoaderCircle className="animate-spin text-lg mx-auto" />
      </div>
    );
  }

  const selectedGrupo = grupos?.find((g) => g.id === selectedGrupoId) || null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Grupos de Trabajo</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gema-green/80 hover:bg-gema-green"
        >
          <CirclePlus className="mr-2 h-4 w-4" />
          Crear nuevo grupo
        </Button>
      </div>

      {/* Modales */}
      <CreateGrupoForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        tecnicosDisponibles={tecnicos || []}
      />

      <GestionTecnicosForm
        open={isTecnicosModalOpen}
        onOpenChange={setIsTecnicosModalOpen}
        grupoTrabajo={selectedGrupo}
        tecnicosDisponibles={tecnicos || []}
        trabajadoresPorGrupo={trabajadoresPorGrupo || {}}
      />

      <EditGrupoForm
        grupo={grupoEditar}
        onClose={() => setGrupoEditar(null)}
        tecnicosDisponibles={tecnicos || []}
      />

      <EliminarGrupoForm
        grupo={grupoEliminar}
        onClose={() => setGrupoEliminar(null)}
      />

      {/* Vista responsiva */}
      <div className="">
        <GruposTable
          grupos={grupos || []}
          trabajadoresPorGrupo={trabajadoresPorGrupo || {}}
          getSupervisorNombre={getSupervisorNombre}
          onEditGrupo={setGrupoEditar}
          onDeleteGrupo={setGrupoEliminar}
          onOpenTecnicos={openTecnicosModal}
        />
      </div>

      <div className="md:hidden">
        <GruposCards
          grupos={grupos || []}
          trabajadoresPorGrupo={trabajadoresPorGrupo || {}}
          getSupervisorNombre={getSupervisorNombre}
          onEditGrupo={setGrupoEditar}
          onDeleteGrupo={setGrupoEliminar}
          onOpenTecnicos={openTecnicosModal}
        />
      </div>
    </div>
  );
};
 
export default GruposTrabajo;