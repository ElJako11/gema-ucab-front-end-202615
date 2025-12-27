'use client';

import { useState } from "react";
import FormNuevoTecnico from "@/components/FormNuevoTecnico";
import { useQuery } from "@tanstack/react-query";
import { tecnicosAPI } from "@/lib/api/tecnicos";
import {
  getAllWorkersInALLGroups,
  getGruposDeTrabajo,
} from "@/lib/gruposDeTrabajo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Tecnico } from "@/types/tecnicos.types";
import { CirclePlus, LoaderCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface GrupoTrabajo {
  id: number;
  codigo: string;
  nombre: string;
  supervisorId: number | null;
}

interface TrabajaEnGrupo {
  grupoDeTrabajoId: number;
  usuarios: Tecnico[];
}

const Tecnicos = () => {
  const [open, setOpen] = useState(false);
  const [modalTecnicoId, setModalTecnicoId] = useState<number | null>(null);

  // Queries mejoradas
  const { data: tecnicosData, isLoading: isLoadingTecnicos } = useQuery({
    queryKey: ["tecnicos"],
    queryFn: tecnicosAPI.getAll,
    select: (data) => {
      // Debug: Ver la respuesta de la API de técnicos
      console.log("Respuesta API técnicos:", data);
      
      // La API devuelve { data: [...] } con estructura: { idTecnico, idGT, nombre }
      if (data?.data) {
        console.log("✅ API devuelve objeto con propiedad data");
        return data;
      }
      
      console.log("❌ Estructura inesperada");
      return { data: [] };
    }
  });

  const { data: gruposData, isLoading: isLoadingGrupos } = useQuery({
    queryKey: ["gruposDeTrabajo"],
    queryFn: getGruposDeTrabajo,
  });

  const { data: trabajadoresData, isLoading: isLoadingTrabajadores } = useQuery({
    queryKey: ["trabajadoresPorGrupo"],
    queryFn: getAllWorkersInALLGroups,
    select: (data: { data: TrabajaEnGrupo[] }) => {
      const map: Record<number, Tecnico[]> = {};
      data.data.forEach((item) => {
        map[item.grupoDeTrabajoId] = item.usuarios;
      });
      return map;
    },
  });

  // Mapeo de técnicos a grupos
  const tecnicoGruposMap: Record<number, GrupoTrabajo[]> = {};
  if (trabajadoresData && gruposData?.data) {
    Object.entries(trabajadoresData).forEach(([grupoId, usuarios]) => {
      usuarios.forEach((usuario) => {
        // Usar idTecnico en lugar de Id
        if (!tecnicoGruposMap[usuario.idTecnico]) {
          tecnicoGruposMap[usuario.idTecnico] = [];
        }
        const grupo = gruposData.data.find((g) => g.id === Number(grupoId));
        if (grupo) {
          tecnicoGruposMap[usuario.idTecnico].push(grupo);
        }
      });
    });
  }

  const isLoading = isLoadingTecnicos || isLoadingGrupos || isLoadingTrabajadores;

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
      </div>
    );
  }

  const tecnicos = tecnicosData?.data || [];
  const gruposDeTecnico = modalTecnicoId ? tecnicoGruposMap[modalTecnicoId] || [] : [];

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Técnicos</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gema-green/80 hover:bg-gema-green">
              <CirclePlus className="mr-2 h-4 w-4" />
              Crear nuevo técnico
            </Button>
          </DialogTrigger>
          <FormNuevoTecnico
            open={open}
            onClose={() => setOpen(false)}
          />
        </Dialog>
      </div>

      {/* Tabla para desktop */}
      <div className="overflow-x-auto">
        <table className="hidden md:table min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Correo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Area
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tecnicos.map((tecnico) => (
              <tr key={tecnico.idTecnico} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {tecnico.nombre}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {tecnico.correo || "No disponible"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="flex items-center justify-center border-2 border-gray-300 rounded-lg bg-gray-200 hover:bg-gray-300 transition px-4 py-2 min-w-[120px]"
                        onClick={() => setModalTecnicoId(tecnico.idTecnico)}
                      >
                        {tecnicoGruposMap[tecnico.idTecnico]?.length || 0} grupo
                        {(tecnicoGruposMap[tecnico.idTecnico]?.length || 0) !== 1 ? 's' : ''}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Ver grupos del técnico</span>
                    </TooltipContent>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil (opcional) */}
      <div className="md:hidden space-y-4">
        {tecnicos.map((tecnico) => (
          <div key={tecnico.idTecnico} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="space-y-2">
              <div>
                <p className="font-medium text-gray-900">{tecnico.nombre}</p>
                <p className="text-sm text-gray-600">{tecnico.correo || "No disponible"}</p>
              </div>
              <button
                className="w-full border-2 border-gray-300 rounded-lg bg-gray-200 hover:bg-gray-300 transition px-4 py-2 text-sm"
                onClick={() => setModalTecnicoId(tecnico.idTecnico)}
              >
                {tecnicoGruposMap[tecnico.idTecnico]?.length || 0} grupo
                {(tecnicoGruposMap[tecnico.idTecnico]?.length || 0) !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de grupos del técnico */}
      <Dialog
        open={modalTecnicoId !== null}
        onOpenChange={(isOpen: boolean) => {
          if (!isOpen) setModalTecnicoId(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Grupos de Trabajo</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {gruposDeTecnico.length > 0 ? (
              gruposDeTecnico.map((grupo) => (
                <div key={grupo.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="font-medium text-gray-900">{grupo.nombre}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Código: {grupo.codigo}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 space-y-3">
                <p className="text-gray-500">No pertenece a ningún grupo</p>
                <Button variant="outline" asChild>
                  <Link href="/grupos-trabajo">
                    Ir a grupos de trabajo
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setModalTecnicoId(null)}
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tecnicos;