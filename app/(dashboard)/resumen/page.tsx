'use client';

import { Button } from "@/components/ui/button";
import DateNavigator from "@/components/ui/dateNavigator";
import DropdownFilter from "@/components/ui/dropdownFilter";
import MaintenanceCard from "@/components/resumen/maintenanceCard";
import type { resumen } from "@/types/resume.types";
import { useSearchParams } from "next/navigation";
import {
    Calendar,
    Upload
} from "lucide-react";
import { useMemo, useState } from "react";
import InspeccionCard from "@/components/resumen/inspeccionCard";
import { useGetResumen } from "@/hooks/resumen/useGetResumen";
import { exportResumenPDF } from "@/lib/api/resumen";

/*Nombres de los meses */
const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

/*Opciones del filtro */
const opcionesFiltro = [
    { id: 'todos', label: 'Todos', color: null },
    { id: 'no-empezado', label: 'No empezado', color: 'bg-gema-darkgrey' },
    { id: 'reprogramado', label: 'Reprogramado', color: 'bg-gema-yellow' },
    { id: 'en-ejecucion', label: 'En ejecucion', color: 'bg-gema-blue' },
    { id: 'culminado', label: 'Culminado', color: 'bg-gema-green' },
];

const resumen = () => {
    const searchParams = useSearchParams();
    const defaultView = searchParams.get('view') === 'semanal' ? 'semanal' : 'mensual';

    //Vista Actual (Mensual o Semanal) por defecto viene del parametro o es mensual
    const [vistaActual, setVistaActual] = useState<'mensual' | 'semanal'>(defaultView);

    // Estado para la fecha actual (mes y año)
    const [currentDate, setCurrentDate] = useState(new Date());

    // Este estado controla qué se mostrara en el resumen
    const [filtroActivo, setFiltroActivo] = useState('todos');

    // Formatear la fecha para la API (YYYY-MM-DD)
    const apiDateParams = useMemo(() => {
        const year = currentDate.getFullYear();
        // OJO: getMonth() devuelve 0-11, sumamos 1. padStart asegura "05" en vez de "5"
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');

        if (vistaActual === 'mensual') {
            return `${year}-${month}-01`;
        } else {
            // Lógica para obtener el lunes de la semana actual
            const d = new Date(currentDate);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            d.setDate(diff);

            const weekMonth = String(d.getMonth() + 1).padStart(2, '0');
            const weekDay = String(d.getDate()).padStart(2, '0');
            return `${d.getFullYear()}-${weekMonth}-${weekDay}`;
        }
    }, [currentDate, vistaActual]);

    //Usar el hook para traer los datos del Backend
    const { data: resumenData, isLoading, isError } = useGetResumen(apiDateParams, vistaActual);

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

    // Función auxiliar para obtener el primer día de la semana (Lunes)
    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que Lunes sea el primer día
        return new Date(d.setDate(diff));
    };

    // Función para generar el texto del header
    const getWeekHeader = (date: Date) => {
        const start = getStartOfWeek(date);
        const end = new Date(start);
        end.setDate(start.getDate() + 6); // Sumar 6 días para obtener el domingo

        // Formato: "DD de MMM - DD de MMM YYYY"
        return `${start.getDate()} de ${MONTH_NAMES[start.getMonth()]} - ${end.getDate()} de ${MONTH_NAMES[end.getMonth()]} ${end.getFullYear()}`;
    };

    // Función para alternar (toggle)
    const alternarVista = () => {
        if (vistaActual === 'mensual') {
            setVistaActual('semanal');
        } else {
            setVistaActual('mensual');
        }
    };

    const handlePrev = () => {
        const newDate = new Date(currentDate);
        if (vistaActual === 'mensual') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            // Si es semanal, restamos 7 días
            newDate.setDate(newDate.getDate() - 7);
        }
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (vistaActual === 'mensual') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else {
            // Si es semanal, sumamos 7 días
            newDate.setDate(newDate.getDate() + 7);
        }
        setCurrentDate(newDate);
    };

    // --- HEADER DINÁMICO ---
    let labelHeader = '';

    if (vistaActual === 'mensual') {
        labelHeader = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    } else {
        // Lógica para vista semanal (calcular inicio y fin de semana)
        const startOfWeek = new Date(currentDate);
        // Ajustamos al lunes más cercano (opcional, depende si quieres que la semana empiece hoy o el lunes)
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Fin de semana (Domingo)

        // Verificamos si la semana cambia de año para mostrarlo correctamente
        const yearStr = endOfWeek.getFullYear();

        labelHeader = `${startOfWeek.getDate()} de ${MONTH_NAMES[startOfWeek.getMonth()]} - ${endOfWeek.getDate()} de ${MONTH_NAMES[endOfWeek.getMonth()]} ${yearStr}`;
    }

    //Unificacion de tareas para facilitar el filtrado
    const allTasks = useMemo(() => {
        if (!resumenData) return [];
        return [
            ...(resumenData.inspecciones || []),
            ...(resumenData.mantenimientos || [])
        ];
    }, [resumenData]);

    //logica de filtrado
    const filteredTasks = allTasks.filter((task) => {
        if (filtroActivo === 'todos') return true;

        // Normalizar: minúsculas y reemplazamos espacios por guiones
        const statusNormalizado = task.estado.toLowerCase().replace(/\s+/g, '-');

        return statusNormalizado === filtroActivo;
    });

    const handleExport = async () => {
        try {

            // response SERÁ el objeto Blob directamente gracias al cambio en client.ts
            const blob = await exportResumenPDF(apiDateParams, vistaActual);

            // Crear URL y descargar
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `pdf`);
            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        
        } catch (error) {
            console.error("Error al exportar PDF:", error);
     
        }
    };

    return (
        <div className="p-6 max-w-7.5xl">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
                <div className="items-center gap-1">
                    <h1 className="text-2xl font-bold">Resumen de Mantenimientos e Inspecciones</h1>
                    <h2 className="text-lg text-gray-500">{labelHeader}</h2>
                </div>
                <Button
                    className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground"
                    onClick={handleExport}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Exportar
                </Button>
            </div>
            <div className="w-full flex justify-end items-center gap-4 mb-4">
                {/* Navegación de Meses */}
                <DateNavigator label={vistaActual === 'mensual' ? 'Mes' : 'Semana'} onPrev={handlePrev} onNext={handleNext}></DateNavigator>
                {/* Boton de filtro dinamico */}
                <DropdownFilter
                    opciones={opcionesFiltro}
                    filtroActual={filtroActivo}
                    onFiltroChange={setFiltroActivo}
                />
                <Button onClick={alternarVista} variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    {vistaActual === 'mensual' ? 'Vista Semanal' : 'Vista Mensual'}
                </Button>
                <Button
                    variant="outline"
                    className="text-gema-green border-gema-green/50 hover:bg-gema-green/10"
                    disabled
                >
                    <Calendar className="mr-2 h-4 w-4" />
                    {vistaActual === 'mensual' ? 'Vista Mensual' : 'Vista Semanal'}
                </Button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                {/*CARDS CON LOS DATOS */}
                <div className="flex flex-col gap-2">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            "idMantenimiento" in task ? (
                                <MaintenanceCard
                                    key={`m-${task.idMantenimiento}`}
                                    mantenimiento={task}
                                />
                            ) : (
                                <InspeccionCard
                                    key={`i-${(task as any).idInspeccion}`}
                                    inspeccion={task as any}
                                />
                            )
                        ))
                    ) : (
                        // Mensaje opcional cuando no hay resultados
                        <div className="text-center py-10 text-gray-400">
                            No hay tareas con el estado "{opcionesFiltro.find(o => o.id === filtroActivo)?.label}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default resumen;