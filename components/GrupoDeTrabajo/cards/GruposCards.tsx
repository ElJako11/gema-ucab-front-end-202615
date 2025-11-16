// src/components/grupos-trabajo/cards/GruposCards.tsx
'use client';

import { ClipboardPen, Trash2, UserCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GruposCardsProps {
  grupos: any[];
  trabajadoresPorGrupo: Record<number, any[]>;
  getSupervisorNombre: (id: number | null) => string;
  onEditGrupo: (grupo: any) => void;
  onDeleteGrupo: (grupo: any) => void;
  onOpenTecnicos: (grupoId: number) => void;
}

export const GruposCards: React.FC<GruposCardsProps> = ({
  grupos,
  trabajadoresPorGrupo,
  getSupervisorNombre,
  onEditGrupo,
  onDeleteGrupo,
  onOpenTecnicos,
}) => {
  return (
    <div className="space-y-4">
      {grupos.map((grupo) => (
        <div
          key={grupo.id}
          className="bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="border-2 border-gray-300 rounded-lg font-bold px-3 py-1 text-sm">
                {grupo.codigo}
              </div>
              <div className="flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="p-1 border-2 border-gray-200 rounded-sm hover:bg-gray-100"
                      onClick={() => onEditGrupo(grupo)}
                    >
                      <ClipboardPen className="h-5 w-5 text-blue-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Editar grupo</span>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="p-1 border-2 border-gray-200 rounded-sm hover:bg-gray-100"
                      onClick={() => onDeleteGrupo(grupo)}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Eliminar grupo</span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-900">{grupo.nombre}</p>
            </div>

            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              <span className="text-sm">
                {getSupervisorNombre(grupo.supervisorId)}
              </span>
            </div>

            <div
              className="border-2 border-gray-300 rounded-lg bg-gray-200 font-medium px-3 py-1 inline-block text-sm cursor-pointer hover:bg-gray-300"
              onClick={() => onOpenTecnicos(grupo.id)}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{trabajadoresPorGrupo[grupo.id]?.length || 0} Técnicos</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Ver técnicos</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};