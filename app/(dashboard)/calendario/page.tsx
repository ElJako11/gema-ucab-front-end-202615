'use client';

import { useState } from 'react';
import { MonthlyCalendar } from "@/components/calendar/monthlyCalendar";
import { WeeklyCalendar } from "@/components/calendar/weeklyCalendar";
import { Button } from "@/components/ui/button";
import { Modal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InspectionFormContent } from "@/components/forms/inspecciones/InspectionFormModal";
import { MaintenanceFormContent } from "@/components/forms/mantenimientos/MaintenanceFormContent";
import { 
    CirclePlus, 
    FileText, 
    Calendar
} from "lucide-react";

const Calendario = () => {
    //Vista Actual del Calendario (Mensual o Semanal) por defecto es mensual
    const [vistaActual, setVistaActual] = useState('mensual');
    
    // Estado para la fecha seleccionada (para navegación entre vistas)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    // Estado para el modal de agregar elemento
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(0);

    // Función para cerrar el modal y resetear el estado
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedType(0); // Resetear la selección
    };

    // Función para manejar el click en un día del calendario mensual
    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setVistaActual('semanal');
    };

    // Función para alternar (toggle)
    const alternarVista = () => {
        if (vistaActual === 'mensual') {
            setVistaActual('semanal');
            // Si no hay fecha seleccionada, usar la fecha actual
            if (!selectedDate) {
                setSelectedDate(new Date());
            }
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
                    <Button className="bg-gema-green hover:bg-green-700 text-white" onClick={() => setIsModalOpen(true)}>
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Nuevo Elemento
                    </Button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                {/**Renderizado del componente del calendario segun la vista actual*/}
                {vistaActual === 'mensual' ? (
                    <MonthlyCalendar onDayClick={handleDayClick} />
                ) : (
                    <WeeklyCalendar initialDate={selectedDate} />
                )}
            </div>

            {/* Modal para agregar nuevo elemento */}
            <Modal
                title="Agregar elemento"
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                className="bg-white max-w-4xl"
            >
                <div>
                    <div className="my-4">
                        <label className="block text-sm font-medium mb-1">Elemento a agregar</label>
                        <Select onValueChange={(value) => setSelectedType(parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tipo de elemento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Mantenimiento</SelectItem>
                                <SelectItem value="2">Inspección</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedType === 1 && (
                        <MaintenanceFormContent 
                            onClose={handleCloseModal}
                            onSuccess={() => {
                                // Aquí puedes agregar lógica adicional después de crear el mantenimiento
                                // Por ejemplo, refrescar el calendario o mostrar una notificación
                                console.log('Mantenimiento creado exitosamente');
                            }}
                        />
                    )}
                    {selectedType === 2 && (
                        <InspectionFormContent 
                            onClose={handleCloseModal}
                            onSuccess={() => {
                                // Aquí puedes agregar lógica adicional después de crear la inspección
                                console.log('Inspección creada exitosamente');
                            }}
                        />
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default Calendario;