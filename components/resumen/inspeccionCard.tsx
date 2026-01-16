import type { ResumenInspeccion } from "@/types/resumenInspeccion.types";

import {
    MapPin,
    Warehouse,
    FileSearchCorner,
    UserRoundSearch,
    Clock
} from "lucide-react";

interface InspeccionCardProps {
    inspeccion: ResumenInspeccion;
    onClick?: () => void;
}

const InspeccionCard = ({
    inspeccion,
    onClick
}: InspeccionCardProps) => {
    // Diccionario para asignar colores según el estado
    const statusStyles = {
        'No empezado': 'bg-white text-black',
        'Reprogramado': 'bg-gema-yellow text-black',
        'En ejecución': 'bg-gema-blue text-black',
        'Culminado': 'bg-gema-green text-black',
    };
    return (
        <div onClick={onClick}
            className={`
            w-full p-4 rounded-xl cursor-pointer transition-all duration-200
            flex justify-between items-start mb-3 text-black bg-sidebar-background
        `}>
            {/* Columna Izquierda: Información */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-x-2">
                    <FileSearchCorner ></FileSearchCorner>
                    <h3 className="font-bold text-lg">{inspeccion.titulo}</h3>
                </div>

                <div className="flex flex-col gap-1 text-sm ml-6">
                    {/* Fila de Ubicación */}
                    <div className="flex items-center gap-2">
                        <MapPin size={16}></MapPin>
                        <span className="font-medium ">{inspeccion.ubicacion}</span>
                    </div>

                    {/* Fila de Área Encargada */}
                    <div className="flex items-center gap-2">
                        <Warehouse size={16}></Warehouse>
                        <span className="font-medium ">{inspeccion.areaEncargada}</span>
                    </div>
                    {/* Fila de Supervisor */}
                    <div className="flex items-center gap-2">
                        <UserRoundSearch size={16}></UserRoundSearch>
                        <span className="font-medium ">{inspeccion.supervisor}</span>
                    </div>
                    {/* Fila de frecuencia */}
                    <div className="flex items-center gap-2">
                        <Clock size={16}></Clock>
                        <span className="font-medium ">{inspeccion.frecuencia}</span>
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Badge de Estado */}
            <div className="m-4">
                <span className={`
                px-3 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap
                ${statusStyles[inspeccion.estado] || 'bg-white text-gray-800'}
                `}>
                    {inspeccion.estado}
                </span>
            </div>
        </div>
    );
}

export default InspeccionCard;