'use client';

import { useState } from 'react';
import { MonthlyCalendar } from "@/components/calendar/monthlyCalendar";
import { WeeklyCalendar } from "@/components/calendar/weeklyCalendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { 
    CirclePlus, 
    FileText, 
    Calendar
} from "lucide-react";

const Calendario = () => {
    //Vista Actual del Calendario (Mensual o Semanal) por defecto es mensual
    const [vistaActual, setVistaActual] = useState('mensual');

    // Función para alternar (toggle)
    const alternarVista = () => {
        if (vistaActual === 'mensual') {
            setVistaActual('semanal');
        } else {
            setVistaActual('mensual');
        }
    };

    return (
        <div className="p-6 max-w-7.5xl">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
                <div className="items-center gap-1">
                    <h1 className="text-2xl font-bold">Calendario de Mantenimiento e Inspecciones</h1>
                    <h2 className="text-lg text-gray-500">Gestiona los mantenimientos preventivos e inspecciones programados por semana</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={alternarVista} className="bg-sidebar-border text-black hover:bg-gray-300">
                        <Calendar className="mr-2 h-4 w-4" />
                        {vistaActual === 'mensual' ? 'Vista Semanal' : 'Vista Mensual'}
                    </Button>
                    <Button className="bg-gema-blue hover:bg-blue-700 text-white">
                        <FileText className="mr-2 h-4 w-4" />
                        Resumen Mensual
                    </Button>
                    <Button className="bg-gema-green hover:bg-green-700 text-white">
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Nuevo Elemento
                    </Button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                {/**Renderizado del componente del calendario segun la vista actual*/}
                {vistaActual === 'mensual' ? <MonthlyCalendar /> : <WeeklyCalendar />}
            </div>
        </div>
    )
}

export default Calendario;