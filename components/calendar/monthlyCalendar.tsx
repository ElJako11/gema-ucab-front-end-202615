'use client';
import { useState } from "react";
import {
    FileCog,
    FileSearchCorner
} from "lucide-react";
import DropdownFilter from "../ui/dropdownFilter";
import DateNavigator from "../ui/dateNavigator";
import { useMantenimientosFiltros } from "@/hooks/mantenimientos/useMantenimientosFiltros";

/*Dias de la semana */
const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/*Nombres de los meses */
const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

interface CalendarDay {
    dia: number;
    actual: boolean;
    date: Date;
}
/*Opciones del filtro */
const opcionesFiltro = [
    { id: 'todos', label: 'Todos', color: null},
    { id: 'mantenimientos', label: 'Mantenimientos Preventivo', color: 'bg-gema-blue' },
    { id: 'inspecciones', label: 'Inspecciones', color: 'bg-gema-green' },
];

/*Array simulado */
const diasSimulados = [
    // Mes anterior (Gris oscuro)
    { dia: 26, actual: false }, { dia: 27, actual: false }, { dia: 28, actual: false },
    { dia: 29, actual: false }, { dia: 30, actual: false }, { dia: 31, actual: false },
    
    // Noviembre (Días del 1 al 30)
    { dia: 1, actual: true, icon: 'green' },
    { dia: 2, actual: true },
    { dia: 3, actual: true, icon: 'multi', hasBar: true }, // El día con la barrita de colores
    { dia: 4, actual: true, icon: 'green' },
    { dia: 5, actual: true, icon: 'multi' },
    { dia: 6, actual: true, icon: 'green' },
    { dia: 7, actual: true, icon: 'green' },
    { dia: 8, actual: true, icon: 'green' },
    { dia: 9, actual: true },
    { dia: 10, actual: true, icon: 'green' },
    { dia: 11, actual: true, icon: 'multi' },
    { dia: 12, actual: true, icon: 'green' },
    { dia: 13, actual: true, icon: 'green' },
    { dia: 14, actual: true, icon: 'multi' },
    { dia: 15, actual: true },
    { dia: 16, actual: true },
    { dia: 17, actual: true, icon: 'green' },
    { dia: 18, actual: true, icon: 'green' },
    { dia: 19, actual: true, icon: 'multi' },
    { dia: 20, actual: true, icon: 'green' },
    { dia: 21, actual: true, icon: 'green' },
    { dia: 22, actual: true },
    { dia: 23, actual: true },
    { dia: 24, actual: true, icon: 'green' },
    { dia: 25, actual: true, icon: 'multi' },
    { dia: 26, actual: true, icon: 'green' },
    { dia: 27, actual: true, icon: 'green' },
    { dia: 28, actual: true, icon: 'green' },
    { dia: 29, actual: true },
    { dia: 30, actual: true }, // Fin de Noviembre
];


// Función para generar los días del calendario dinámicamente
const generateCalendarDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Primer día del mes y qué día de la semana es (0 = domingo)
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();

    // Días en el mes actual
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Días en el mes anterior
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    // Días del mes anterior (para completar la primera semana)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        days.push({
            dia: day,
            actual: false,
            date: new Date(year, month - 1, day)
        });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
        days.push({
            dia: day,
            actual: true,
            date: new Date(year, month, day)
        });
    }

    // Días del mes siguiente (para completar la última semana)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length;

    for (let day = 1; day <= remainingCells; day++) {
        days.push({
            dia: day,
            actual: false,
            date: new Date(year, month + 1, day)
        });
    }

    return days;
};

interface MonthlyCalendarProps {
    onDayClick?: (date: Date) => void;
}

const MonthlyCalendar = ({ onDayClick }: MonthlyCalendarProps) => {
    // Este estado controla qué iconos se ven en TODO el calendario
    const [filtroActivo, setFiltroActivo] = useState('todos');

    // Estado para la fecha actual (mes y año)
    const [currentDate, setCurrentDate] = useState(new Date());

    // Formatear fecha para el hook (YYYY-MM-DD)
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Fetch de eventos del calendario (mantenimientos e inspecciones)
    const { data: datosCalendario, isLoading, error } = useMantenimientosFiltros(formattedDate, "mensual");

    // Extraer arrays separados
    const inspecciones = datosCalendario?.inspecciones || [];
    const mantenimientos = datosCalendario?.mantenimientos || [];

    // Helper para verificar si hay mantenimientos en una fecha
    const hasMantenimientos = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        
        const mantenimientosDelDia = mantenimientos.filter((mantenimiento: any) => {
            const fechaEvento = mantenimiento.fechaLimite || mantenimiento.fecha || '';
            return fechaEvento === dateStr;
        });
        
        console.log(`🔍 [CALENDARIO MENSUAL] Mantenimientos para ${dateStr}:`, {
            cantidad: mantenimientosDelDia.length,
            mantenimientos: mantenimientosDelDia,
            fechaBuscada: dateStr,
            mantenimientosDisponibles: mantenimientos.map(m => ({
                id: m.idMantenimiento,
                fechaLimite: m.fechaLimite,
                titulo: m.titulo
            }))
        });
        
        return mantenimientosDelDia.length > 0;
    };

    // Helper para verificar si hay inspecciones en una fecha
    const hasInspecciones = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        
        const inspeccionesDelDia = inspecciones.filter((inspeccion: any) => {
            // Las inspecciones usan fechaCreacion, no fechaLimite
            const fechaEvento = inspeccion.fechaCreacion || inspeccion.fecha || '';
            return fechaEvento === dateStr;
        });
        
        console.log(`🔍 [CALENDARIO MENSUAL] Inspecciones para ${dateStr}:`, {
            cantidad: inspeccionesDelDia.length,
            inspecciones: inspeccionesDelDia,
            fechaBuscada: dateStr,
            inspeccionesDisponibles: inspecciones.map(i => ({
                id: i.idInspeccion,
                fechaCreacion: i.fechaCreacion,
                titulo: i.titulo
            }))
        });
        
        return inspeccionesDelDia.length > 0;
    };

    // Generar días del calendario basándose en la fecha actual
    const diasCalendario = generateCalendarDays(currentDate);

    // Función para manejar el click en un día
    const handleDayClick = (dayItem: CalendarDay) => {
        if (!dayItem.actual || !onDayClick) return;
        onDayClick(dayItem.date);
    };

    // Lógica específica del MES: sumar/restar el mes
    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    // Formateo para la etiqueta
    const labelHeader = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    return (
        <div>
            {/*--- CABECERA DEL CALENDARIO ---*/}
            <div className="flex flex-col md:flex-row md:justify-between items-start">
                <h2 className="text-xl font-semibold mb-4">{labelHeader}</h2>
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    {/* Boton de filtro dinamico */}
                    <DropdownFilter 
                        opciones={opcionesFiltro}
                        filtroActual={filtroActivo} 
                        onFiltroChange={setFiltroActivo} 
                    />
                    {/* Navegación de Meses */}
                    <DateNavigator label='Mes' onPrev={handlePrevMonth} onNext={handleNextMonth}></DateNavigator>
                </div>
            </div>

            {/*--- CUADRÍCULA DEL CALENDARIO ---*/}
            <div className="p-6 w-full max-w-5xl mx-auto">
                {/* --- CABECERA DE DÍAS (LUN, MAR...) --- */}
                <div className="hidden md:grid grid-cols-7 gap-2 mb-2 text-center">
                    {diasSemana.map((dia) => (
                        <span key={dia} className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            {dia}
                        </span>
                    ))}
                </div>

                {/* --- CUADRÍCULA DEL CALENDARIO (GRID) --- */}
                <div className="hidden md:grid grid-cols-7 gap-2 auto-rows-fr justify-center">
                    {diasCalendario.map((item, index) => {
                        const tieneMantenimientos = hasMantenimientos(item.date);
                        const tieneInspecciones = hasInspecciones(item.date);

                        return (
                            <div
                                key={index}
                                onClick={() => handleDayClick(item)}
                                className={`
                                        relative min-h-30 max-w-full p-2 rounded-lg flex flex-col gap-2 transition-all hover:ring-2 hover:ring-blue-100 cursor-pointer 
                                        ${item.actual ? 'bg-gema-lightgrey hover:bg-gray-50' : 'bg-gema-darkgrey cursor-default'}
                                    `}
                            >
                                {/* Número del día */}
                                <span className={`text-sm font-bold text-gema-grey-text`}>
                                    {item.dia < 10 ? `0${item.dia}` : item.dia}
                                </span>

                                {/* Iconos de contenido */}
                                <div className="flex gap-1">
                                    {/* Icono de Mantenimientos (azul) */}
                                    {(filtroActivo === 'todos' || filtroActivo === 'mantenimientos') && 
                                    tieneMantenimientos && (
                                        <FileCog className="w-7 h-7 text-gema-blue" />
                                    )}
                                    
                                    {/* Icono de Inspecciones (verde) */}
                                    {(filtroActivo === 'todos' || filtroActivo === 'inspecciones') && 
                                    tieneInspecciones && (
                                        <FileSearchCorner className="w-7 h-7 text-gema-green" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export { MonthlyCalendar };