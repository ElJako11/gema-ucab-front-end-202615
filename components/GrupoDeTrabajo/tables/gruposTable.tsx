// components/tables/GruposTable.tsx
import { ClipboardPen, Trash2, UserCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GruposTableProps {
  grupos: any[];
  trabajadoresPorGrupo: Record<number, any[]>;
  getSupervisorNombre: (id: number | null) => string;
  onEditGrupo: (grupo: any) => void;
  onDeleteGrupo: (grupo: any) => void;
  onOpenTecnicos: (grupoId: number) => void;
}

export const GruposTable: React.FC<GruposTableProps> = ({
  grupos,
  trabajadoresPorGrupo,
  getSupervisorNombre,
  onEditGrupo,
  onDeleteGrupo,
  onOpenTecnicos,
}) => {
  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Código
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nombre del Grupo
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Supervisor
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Técnicos
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {grupos.map((grupo) => (
          <tr key={grupo.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center justify-center border-2 border-gray-300 rounded-lg font-bold text-sm py-1">
                {grupo.codigo}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {grupo.nombre}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-500" />
                <span>{getSupervisorNombre(grupo.supervisorId)}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="flex items-center justify-center border-2 border-gray-300 rounded-lg bg-gray-200 font-medium hover:bg-gray-300 transition cursor-pointer py-1"
                    onClick={() => onOpenTecnicos(grupo.id)}
                  >
                    {trabajadoresPorGrupo[grupo.id]?.length || 0}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Ver técnicos</span>
                </TooltipContent>
              </Tooltip>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="flex items-center gap-2">
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};