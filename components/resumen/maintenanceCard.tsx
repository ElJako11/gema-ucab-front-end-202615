import type { ResumenMantenimiento } from "@/types/resumenMantenimiento.type";

import { 
    MapPin, 
    Calendar,
    FileSearchCorner, 
    FileCog
} from "lucide-react";

interface MaintenanceCardProps {
  mantenimiento: ResumenMantenimiento;
  onClick?: () => void;
}

const MaintenanceCard = ({
    mantenimiento,
    onClick 
}: MaintenanceCardProps) => {
    // Diccionario para asignar colores según el estado
    const statusStyles = {
        'No Empezado': 'bg-gema-darkgrey text-black',
        'Reprogramado': 'bg-gema-yellow text-black', 
        'En Ejecucion': 'bg-gema-blue text-black',
        'Culminado': 'bg-gema-green text-black',
    };
    return(
        <div onClick={onClick}
        className={`
            w-full p-4 rounded-xl cursor-pointer transition-all duration-200
            flex justify-between items-start mb-3 text-black bg-sidebar-background
        `}>
            {/* Columna Izquierda: Información */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-x-2">
                    <FileCog ></FileCog>
                    <h3 className="font-bold text-lg">{mantenimiento.titulo}</h3>
                    <h4 className="font-semibold text-lg">{mantenimiento.ubicacion}</h4>
                </div>
                
                <div className="flex flex-col gap-1 text-sm ml-6">
                {/* Fila de Ubicación */}
                <div className="flex items-center gap-2">
                    <MapPin size={16}></MapPin>
                    <span className="font-medium ">{mantenimiento.ubicacion}</span>
                </div>

                {/* Fila de Fecha */}
                <div className="flex items-center gap-2">
                    <Calendar size={16}></Calendar>
                    <span>{mantenimiento.fechaLimite.toLocaleDateString()}</span>
                </div>
                </div>
            </div>

            {/* Columna Derecha: Badge de Estado */}
            <div className="m-4">
                <span className={`
                px-3 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap
                ${statusStyles[mantenimiento.estado] || 'bg-gray-200 text-gray-800'}
                `}>
                {mantenimiento.estado}
                </span>
            </div>
        </div>
    );
}

export default MaintenanceCard;