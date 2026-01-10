'use client';

import { useState } from "react";
import { UserCheck, CirclePlus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGrupo, useGrupos} from "@/hooks/grupos-trabajo/useGrupoTrabajo";
import { useTecnicos } from "@/hooks/tecnicos/useTecnicos";
import { useSupervisores } from "@/hooks/usuarios/useUsuarios";
import { useTrabajadoresPorGrupo } from "@/hooks/grupos-trabajo/useTrabajadoresPorGrupo";
import { CreateGrupoForm } from "@/components/forms/grupos/CreateGrupoForm";
import { EditGrupoForm } from "@/components/forms/grupos/EditGrupoForm";
import { EliminarGrupoForm } from "@/components/forms/grupos/EliminarGrupoForm";
import { GestionTecnicosForm } from "@/components/forms/grupos/GestionTecnicosForm";
import { GruposTable } from "@/components/GrupoDeTrabajo/tables/gruposTable";
import { GruposCards } from "@/components/GrupoDeTrabajo/cards/GruposCards";
import React from 'react';

const GruposTrabajo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTecnicosModalOpen, setIsTecnicosModalOpen] = useState(false);
  const [selectedGrupoId, setSelectedGrupoId] = useState<number | null>(null);
  const [grupoEditar, setGrupoEditar] = useState<any>(null);
  const [grupoEliminar, setGrupoEliminar] = useState<any>(null);

  const { data: grupos = [], isLoading: gruposLoading } = useGrupos();
  const { tecnicos = [], isLoading: tecnicosLoading } = useTecnicos();
  const { supervisores, isLoading: supervisoresLoading } = useSupervisores();
  const { data: trabajadoresPorGrupo = [], isLoading: trabajadoresLoading } = useTrabajadoresPorGrupo();

  const isLoading = gruposLoading || tecnicosLoading || supervisoresLoading || trabajadoresLoading;

  const openTecnicosModal = (grupoId: number) => {
    setSelectedGrupoId(grupoId);
    setIsTecnicosModalOpen(true);
  };

  const getSupervisorNombre = (id: number | null) =>
    supervisores?.find((s) => s.id === id)?.nombre || "No asignado";

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <LoaderCircle className="animate-spin text-lg mx-auto" />
      </div>
    );
  }

  const selectedGrupo = grupos?.find((g) => g.id === selectedGrupoId) || null;


  console.log("Grupos de Trabajo:", grupos);
  console.log("Técnicos:", tecnicos);
  console.log("Supervisores:", supervisores);
  console.log("Trabajadores por Grupo:", trabajadoresPorGrupo);
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
      />

      <GestionTecnicosForm
        open={isTecnicosModalOpen}
        onOpenChange={setIsTecnicosModalOpen}
        grupoTrabajo={selectedGrupo}
        trabajadoresPorGrupo={trabajadoresPorGrupo || {}}
      />

      <EditGrupoForm
        grupo={grupoEditar}
        setGrupo={setGrupoEditar}
      />

      <EliminarGrupoForm
        grupo={grupoEliminar}
        setGrupo={setGrupoEliminar}
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