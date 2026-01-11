'use client';

import { useState } from "react";
import FormNuevoTecnico from "@/components/forms/tecnicos/FormNuevoTecnico";
import { EliminarTecnicoForm } from "@/components/forms/tecnicos/FormEliminarTecnico";
import { EditarTecnicoForm } from "@/components/forms/tecnicos/EditTecnicoForm";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ClipboardPen, Trash2, CirclePlus, LoaderCircle, } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tecnico } from "@/types/tecnicos.types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTecnicos } from "@/hooks/tecnicos/useTecnicos";

const Tecnicos = () => {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [modalTecnicoId, setModalTecnicoId] = useState<number | null>(null);
  const [tecnico, setTecnico] = useState<Tecnico | null>(null);

  // State placeholder para editar (opcional si se implementa luego)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tecnicoEditar, setTecnicoEditar] = useState<Tecnico | null>(null);

  const { tecnicos, isLoading } = useTecnicos();

console.log("Técnicos cargados:", tecnicos);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
      </div>
    );
  }

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
        <table className="hidden md:table min-w-full table-fixed bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/4">
                Correo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/4">
                Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/4">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tecnicos.map((tecnico) => (
              <tr key={tecnico.idTecnico} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 w-1/4 max-w-0">
                  <div className="truncate" title={tecnico.nombre}>
                    {tecnico.nombre}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 w-1/4 max-w-0">
                  <div className="truncate" title={tecnico.correo || "No disponible"}>
                    {tecnico.correo || "No disponible"}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm w-1/4 max-w-0">
                  <div className="truncate" title={tecnico.area || "No disponible"}>
                    {tecnico.area || "No disponible"}
                  </div>
                </td>
                <td className="w-1/4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-block m-2 p-1 border-2 border-gray-200 rounded-sm">
                        <ClipboardPen
                          className="h-5 w-5 text-blue-500 cursor-pointer"
                          onClick={() => setTecnicoEditar(tecnico)}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Editar usuario</span>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-block m-2 p-1 border-2 border-gray-200 rounded-sm">
                        <Trash2
                          className="h-5 w-5 text-red-500 cursor-pointer"
                          onClick={() => setTecnico(tecnico)}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Eliminar Tecnico</span>
                    </TooltipContent>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="md:hidden space-y-4">
        {tecnicos.map((tecnico) => (
          <div key={tecnico.idTecnico} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="space-y-2">
              <div>
                <p className="font-medium text-gray-900">{tecnico.nombre}</p>
                <p className="text-sm text-gray-600">
                  <span className="text-sm font-semibold">Correo: </span>
                  {tecnico.correo || "No disponible"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="text-sm font-semibold">Área: </span>
                  {tecnico.area || "No disponible"}
                </p>
                <div className="flex gap-2 mt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-block p-1 border-2 border-gray-200 rounded-sm">
                        <ClipboardPen
                          className="h-5 w-5 text-blue-500 cursor-pointer"
                          onClick={() => setTecnicoEditar(tecnico)}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Editar usuario</span>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-block p-1 border-2 border-gray-200 rounded-sm">
                        <Trash2
                          className="h-5 w-5 text-red-500 cursor-pointer"
                          onClick={() => setTecnico(tecnico)}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Eliminar Tecnico</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tecnicoEditar && (
        <EditarTecnicoForm
          open={!!tecnicoEditar}
          onClose={() => setTecnicoEditar(null)}
          tecnico={tecnicoEditar}
        />
      )}

      {tecnico && (
        <EliminarTecnicoForm
          tecnico={tecnico}
          setTecnico={setTecnico}
        />
      )}
    </div>
  );
};

export default Tecnicos;