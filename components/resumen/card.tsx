import { 
    MapPin, 
    Calendar,
    FileSearchCorner, 
    FileCog
} from "lucide-react";

interface MaintenanceCardProps {
  title: string;
  location: string; 
  date: string;
  status: 'No empezado' | 'Reprogramado' | 'En ejecucion' | 'Culminado';
  type: 'Mantenimiento' | 'Inspección';
  onClick?: () => void;
}

const Card = ({
    title, 
    location, 
    date, 
    status, 
    type,
    onClick 
}: MaintenanceCardProps) => {
    // Diccionario para asignar colores según el estado
    const statusStyles = {
        'No empezado': 'bg-gema-darkgrey text-black',
        'Reprogramado': 'bg-gema-yellow text-black', 
        'En ejecucion': 'bg-gema-blue text-black',
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
                    {type === "Mantenimiento" ? <FileCog ></FileCog> : <FileSearchCorner ></FileSearchCorner>}
                    <h3 className="font-bold text-lg">{title}</h3>
                </div>
                
                <div className="flex flex-col gap-1 text-sm ml-6">
                {/* Fila de Ubicación */}
                <div className="flex items-center gap-2">
                    <MapPin size={16}></MapPin>
                    <span className="font-medium ">{location}</span>
                </div>

                {/* Fila de Fecha */}
                <div className="flex items-center gap-2">
                    <Calendar size={16}></Calendar>
                    <span>{date}</span>
                </div>
                </div>
            </div>

            {/* Columna Derecha: Badge de Estado */}
            <div className="m-4">
                <span className={`
                px-3 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap
                ${statusStyles[status] || 'bg-gray-200 text-gray-800'}
                `}>
                {status}
                </span>
            </div>
        </div>
    );
}

export default Card;