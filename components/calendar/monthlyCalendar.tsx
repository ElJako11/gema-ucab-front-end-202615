'use client';
import { useState } from "react";

import { 
    FileSearchCorner, 
    FileCog
} from "lucide-react";
import DropdownFilter from "../ui/dropdownFilter";
import DateNavigator from "../ui/dateNavigator";

/*Dias de la semana */
const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/*Nombres de los meses */
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
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

    // Mes siguiente (Gris oscuro)
    { dia: 1, actual: false }, { dia: 2, actual: false }, { dia: 3, actual: false },
    { dia: 4, actual: false }, { dia: 5, actual: false }, { dia: 6, actual: false },
  ];

const MonthlyCalendar = () => {
    // Este estado controla qué iconos se ven en TODO el calendario
    const [filtroActivo, setFiltroActivo] = useState('todos');

    // Estado para la fecha actual (mes y año)
    const [currentDate, setCurrentDate] = useState(new Date());

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
    const labelHeader = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;  //currentDate.getMonth() devuelve un número de 0 a 11 (0 es enero y 11 es diciembre)

    return(
        <div>
            {/*--- CABECERA DEL CALENDARIO ---*/}
            <div className="flex flex-col md:flex-row md:justify-between items-start">
                <h2 className="text-xl font-semibold mb-4">{labelHeader}</h2>
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    {/* Boton de filtro dinamico */}
                    <DropdownFilter 
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
                        {diasSimulados.map((item, index) => (
                            <div
                                key={index}
                                className={`
                                    relative min-h-30 max-w-full p-2 rounded-lg flex flex-col gap-2 transition-all hover:ring-2 hover:ring-blue-100 cursor-pointer 
                                    ${item.actual ? 'bg-gema-lightgrey' : 'bg-gema-darkgrey'}
                                `}
                            >
                                {/* Barra de colores (Ejemplo del día 3) */}
                                {item.hasBar && (
                                    <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-lg bg-linear-to-r from-gema-yellow via-gema-blue to-gema-green" />
                                )}

                                {/* Número del día */}
                                <span className={`text-sm font-bold text-gema-grey-text`}>
                                {item.dia < 10 ? `0${item.dia}` : item.dia}
                                </span>

                                {/* Iconos de contenido */}
                                <div className="flex gap-1">
                                    {/*Logica de filtrado */}
                                    {(filtroActivo === 'todos' || filtroActivo === 'mantenimientos') && 
                                    (item.icon === 'multi') && (
                                        <FileCog className="h-7 w-7 text-gema-blue" />
                                    )}
                                    {(filtroActivo === 'todos' || filtroActivo === 'inspecciones') && 
                                    (item.icon === 'green' || item.icon === 'multi') && (
                                        <FileSearchCorner className="h-7 w-7 text-gema-green" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div> 
    )
}

export {MonthlyCalendar};