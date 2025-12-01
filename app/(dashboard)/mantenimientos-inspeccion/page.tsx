'use client'

import { useQuery } from "@tanstack/react-query";
import { getMantenimientosInspeccion } from "@/lib/mantenimientosInspeccion";
import { LoaderCircle, MapPin } from "lucide-react";
import type { MantenimientoInspeccion } from "@/types/models/mantenimientosInspeccion.types";

const MantenimientosInspeccion = () => {
  const { data: mantenimientosData, isLoading } = useQuery({
    queryKey: ["mantenimientosInspeccion"],
    queryFn: getMantenimientosInspeccion,
  });

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
      </div>
    );
  }

  const mantenimientos = mantenimientosData?.data || [];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "culminado":
        return "border-green-600 bg-green-100";
      case "no_empezado":
        return "border-gray-500 bg-gray-100";
      case "reprogramado":
        return "border-yellow-500 bg-yellow-100";
      default:
        return "border-gray-300 bg-white";
    }
  };

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-6">
        <h1 className="text-2xl font-bold">Mantenimientos por Inspección</h1>
        <div className="flex flex-col gap-2 text-xs text-gray-600 mt-2 md:mt-0">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Culminado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>No empezado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span>Reprogramado</span>
          </div>
        </div>
      </div>

      {/* Tabla para desktop */}
      <div className="overflow-x-auto">
        <table className="hidden md:table min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mantenimiento generado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Inspección asociada
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mantenimientos.length > 0 ? (
              mantenimientos.map((mantenimiento) => (
                <tr key={mantenimiento.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className={`flex flex-col border-2 rounded-lg px-3 py-2 ${getEstadoColor(mantenimiento.estado)}`}>
                      <div className="font-medium">{mantenimiento.mantenimientoGenerado}</div>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-700">
                        <MapPin className="w-4 h-4" />
                        <span>{mantenimiento.ubicacion}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-col border-2 border-gray-300 rounded-lg px-3 py-2">
                      <div className="font-medium">{mantenimiento.inspeccionAsociada}</div>
                      <div className="text-xs text-gray-700 mt-2">
                        {mantenimiento.nota}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay mantenimientos por inspección registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="md:hidden space-y-4">
        {mantenimientos.length > 0 ? (
          mantenimientos.map((mantenimiento) => (
            <div key={mantenimiento.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Mantenimiento generado</p>
                  <div className={`flex flex-col border-2 rounded-lg px-3 py-2 mt-1 ${getEstadoColor(mantenimiento.estado)}`}>
                    <p className="font-medium text-gray-900">{mantenimiento.mantenimientoGenerado}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span>{mantenimiento.ubicacion}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Inspección asociada</p>
                  <div className="flex flex-col border-2 border-gray-300 rounded-lg px-3 py-2 mt-1">
                    <p className="text-sm font-medium text-gray-900">{mantenimiento.inspeccionAsociada}</p>
                    <p className="text-xs text-gray-700 mt-2">
                      {mantenimiento.nota}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            No hay mantenimientos por inspección registrados
          </div>
        )}
      </div>
    </div>
  )
}

export default MantenimientosInspeccion

