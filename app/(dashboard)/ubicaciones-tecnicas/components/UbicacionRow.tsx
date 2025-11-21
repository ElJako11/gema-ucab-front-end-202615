import React from "react";
import {
    CirclePlus,
    CornerDownRight,
    Eye,
    EyeOff,
    Pencil,
    Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UbicacionTecnica } from "@/types/models/ubicacionesTecnicas.types";

interface UbicacionRowProps {
    ubicacion: UbicacionTecnica;
    isViewing: boolean;
    onViewDetails: (detalle: UbicacionTecnica | null) => void;
    onCreateFrom: (codigo: string) => void;
    onEdit: (detalle: UbicacionTecnica) => void;
    onDelete: (detalle: UbicacionTecnica) => void;
}

export const UbicacionRow: React.FC<UbicacionRowProps> = ({
    ubicacion,
    isViewing,
    onViewDetails,
    onCreateFrom,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="flex px-4 py-2 bg-white hover:bg-gray-50 items-center">
            <div className="flex-1 flex flex-row items-center gap-2">
                <div style={{ paddingLeft: `${(ubicacion.nivel - 1) * 20}px` }}>
                    {ubicacion.nivel > 1 && (
                        <CornerDownRight size={18} className="text-gray-400" />
                    )}
                </div>
                <div>
                    <p className="font-mono font-semibold text-sm">
                        {ubicacion.codigo_Identificacion}
                    </p>
                    <p className="text-sm text-gray-700">{ubicacion.descripcion}</p>
                </div>
            </div>
            <div className="flex items-center justify-end gap-1 ml-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            className="text-blue-600 !px-2"
                            aria-label={isViewing ? "Cerrar detalles" : "Ver detalles"}
                            onClick={() => onViewDetails(isViewing ? null : ubicacion)}
                        >
                            {isViewing ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>{isViewing ? "Cerrar detalles" : "Ver detalles"}</span>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            className="text-gray-500 !px-2"
                            aria-label="Crear ubicación desde esta"
                            onClick={() => onCreateFrom(ubicacion.codigo_Identificacion)}
                        >
                            <CirclePlus size={16} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>Crear ubicación a partir de esta</span>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            className="text-yellow-600 !px-2 hover:text-yellow-700"
                            aria-label="Editar descripción"
                            onClick={() => onEdit(ubicacion)}
                        >
                            <Pencil size={16} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>Editar descripción</span>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            className="text-red-500 !px-2 hover:text-red-600"
                            aria-label="Eliminar ubicación"
                            onClick={() => onDelete(ubicacion)}
                        >
                            <Trash size={16} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>Eliminar ubicación</span>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
};
