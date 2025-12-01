'use client'

import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getPlantillas } from "@/lib/plantillas";
import { LoaderCircle, ClipboardPen, Trash2, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import FormNuevaPlantilla from "@/components/FormNuevaPlantilla";
import type { Plantilla } from "@/types/models/plantillas.types";

const Plantillas = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: plantillasData, isLoading, refetch } = useQuery({
    queryKey: ["plantillas"],
    queryFn: getPlantillas,
  });

  const handleSuccess = () => {
    refetch();
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
      </div>
    );
  }

  const plantillas = plantillasData?.data || [];

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Plantillas</h1>
          <p className="text-muted-foreground">Plantillas de Checklist y Mantenimientos por Condición</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gema-green hover:bg-green-700"
              onClick={() => setIsDialogOpen(true)}
            >
              <CirclePlus className="mr-2 h-4 w-4" />
              Nueva Plantilla
            </Button>
          </DialogTrigger>
          <FormNuevaPlantilla 
            open={isDialogOpen} 
            onClose={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>

      {/* Tabla para desktop */}
      <div className="overflow-x-auto">
        <table className="hidden md:table min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plantilla
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tipo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plantillas.length > 0 ? (
              plantillas.map((plantilla) => (
                <tr key={plantilla.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center border-2 border-gray-500 rounded-lg px-3 py-2 bg-gray-100">
                        {plantilla.plantilla}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="px-3 py-2">
                        <span className="text-sm text-gray-900">{plantilla.tipo}</span>
                      </div>
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2 justify-end">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="p-1 border-2 border-gray-200 rounded-sm hover:bg-gray-100"
                            onClick={() => console.log('editar plantilla', plantilla.id)}
                          >
                            <ClipboardPen className="h-5 w-5 text-blue-500" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>Editar plantilla</span>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="p-1 border-2 border-gray-200 rounded-sm hover:bg-gray-100"
                            onClick={() => console.log('eliminar plantilla', plantilla.id)}
                          >
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>Eliminar plantilla</span>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay plantillas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista movil */}
      <div className="md:hidden space-y-4">
        {plantillas.length > 0 ? (
          plantillas.map((plantilla) => (
            <div key={plantilla.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Plantilla</p>
                      <div className="border-2 border-gray-500 rounded-lg px-3 py-2 mt-1 bg-gray-100">
                        <p className="font-medium text-gray-900">{plantilla.plantilla}</p>
                      </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Tipo</p>
                    <div className="mt-1 px-0">
                      <p className="text-sm text-gray-900">{plantilla.tipo}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="p-1 border-2 border-gray-200 rounded-sm hover:bg-gray-100"
                        onClick={() => console.log('editar plantilla mobile', plantilla.id)}
                      >
                        <ClipboardPen className="h-5 w-5 text-blue-500" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Editar plantilla</span>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="p-1 border-2 border-gray-200 rounded-sm hover:bg-gray-100"
                        onClick={() => console.log('eliminar plantilla mobile', plantilla.id)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Eliminar plantilla</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            No hay plantillas registradas
          </div>
        )}
      </div>
    </div>
  )
}

export default Plantillas

