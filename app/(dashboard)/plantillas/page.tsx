'use client'

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlantillas, deletePlantilla } from "@/lib/plantillas";
import { LoaderCircle, ClipboardPen, Trash2, CirclePlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "react-hot-toast";
import FormNuevaPlantilla from "@/components/forms/plantillas/FormNuevaPlantilla";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import type { Plantilla } from "@/types/models/plantillas.types";

const Plantillas = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlantilla, setEditingPlantilla] = useState<Plantilla | null>(null);
  const [deletingPlantillaId, setDeletingPlantillaId] = useState<number | null>(null);

  const { data: plantillasData, isLoading } = useQuery({
    queryKey: ["plantillas"],
    queryFn: getPlantillas,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlantilla,
    onSuccess: () => {
      toast.success("Plantilla eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["plantillas"] });
      setDeletingPlantillaId(null);
    },
    onError: (error) => {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar la plantilla");
    }
  });

  const handleEdit = (plantilla: Plantilla) => {
    setEditingPlantilla(plantilla);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPlantilla(null);
  };

  const handleDelete = () => {
    if (deletingPlantillaId) {
      deleteMutation.mutate(deletingPlantillaId);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
      </div>
    );
  }

  const plantillas = (plantillasData?.data || []).filter((p: Plantilla) => p.tipo === 'Checklist');

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Plantillas</h1>
          <p className="text-muted-foreground">Plantillas de Checklist</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gema-green hover:bg-green-700"
              onClick={() => {
                setEditingPlantilla(null);
                setIsDialogOpen(true);
              }}
            >
              <CirclePlus className="mr-2 h-4 w-4" />
              Nueva Plantilla
            </Button>
          </DialogTrigger>
          <FormNuevaPlantilla
            open={isDialogOpen}
            onClose={handleCloseDialog}
            initialData={editingPlantilla}
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
                    <Link href={`/detalle-trabajo?id=${plantilla.id}`} className="flex items-center border-2 border-gray-500 rounded-lg px-3 py-2 bg-gray-100">
                      {plantilla.plantilla}
                    </Link>
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
                            onClick={() => handleEdit(plantilla)}
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
                            onClick={() => setDeletingPlantillaId(plantilla.id)}
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
                    <Link href={`/detalle-trabajo?id=${plantilla.id}`} className="block border-2 border-gray-500 rounded-lg px-3 py-2 mt-1 bg-gray-100">
                      <p className="font-medium text-gray-900">{plantilla.plantilla}</p>
                    </Link>
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
                        onClick={() => handleEdit(plantilla)}
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
                        onClick={() => setDeletingPlantillaId(plantilla.id)}
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

      <ConfirmDeleteDialog
        open={!!deletingPlantillaId}
        onClose={() => setDeletingPlantillaId(null)}
        onConfirm={handleDelete}
        title="¿Eliminar plantilla?"
        description="Esta acción no se puede deshacer. La plantilla será eliminada permanentemente del sistema."
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

export default Plantillas

