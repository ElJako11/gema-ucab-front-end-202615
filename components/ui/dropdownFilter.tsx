'use client';

import { ChevronDown, Filter, Funnel } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

const opcionesFiltro = [
    { id: 'todos', label: 'Todos', color: null },
    { id: 'mantenimientos', label: 'Mantenimientos Preventivo', color: 'bg-gema-blue' },
    { id: 'inspecciones', label: 'Inspecciones', color: 'bg-gema-green' },
];

interface DropdownFiltroProps {
    filtroActual: string;                   // El ID del filtro actual ('todos', 'mantenimientos', 'inspecciones')
    onFiltroChange: (nuevoId: string) => void; // La función "mando a distancia" para avisar al padre
}

export default function DropdownFilter({ filtroActual, onFiltroChange }: DropdownFiltroProps) {
    //Estado para controlar si el menú está abierto o cerrado
    const [isOpen, setIsOpen] = useState(false);

    // Estado para controlar qué filtro está seleccionado
    const [filtroActivo, setFiltroActivo] = useState('todos'); // 'todos', 'mantenimientos', 'inspecciones'
    //Vista del calendario: inspecciones y mantenimientos programados por mes
    const [mostrarMenuFiltro, setMostrarMenuFiltro] = useState(false);

    // Función auxiliar para obtener el nombre del filtro actual para el botón
    const obtenerNombreFiltro = () => {
        const opcion = opcionesFiltro.find(op => op.id === filtroActivo);
            return opcion ? opcion.label : 'Filtrar';
    };

    //Nombre del boton
    const opcionActual = opcionesFiltro.find(op => op.id === filtroActual);
    const labelMostrar = opcionActual ? opcionActual.label : 'Filtrar';

    return(
        <div className="relative">
            {/*Boton principal */}
            <Button className="bg-sidebar-border text-black hover:bg-gray-300"
            onClick={() => setIsOpen(!isOpen)}> {/* Alternar menú */}
                <Funnel className="mr-2 h-4 w-4" />
                <span>{labelMostrar}</span>
                <ChevronDown className={`h-3 w-3 opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
            {/*Menú desplegable */}
            {isOpen && (
                <>
                {/* Div invisible para cerrar el menú si se hace click afuera */}
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 p-1 animate-in fade-in zoom-in-95 duration-100">
                    {opcionesFiltro.map((opcion) => (
                    <button
                        key={opcion.id}
                        onClick={() => {
                            onFiltroChange(opcion.id); // Avisar al componente padre
                            setIsOpen(false);          // Cerrar menu
                        }}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors text-left
                            ${filtroActual === opcion.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}
                        `}
                    >
                        {/* Círculo de color o icono */}
                        {opcion.color ? (
                        <div className={`h-3 w-3 rounded-full ${opcion.color}`} />
                        ) : (
                        <Filter className="h-3 w-3" />
                        )}
                        {opcion.label}
                    </button>
                    ))}
                </div>
                </>
            )}
        </div>
    )
}