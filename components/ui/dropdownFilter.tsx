'use client';

import { ChevronDown, Filter, Funnel } from "lucide-react";
import { useState } from "react";
import { Button } from "./button"; // Asegúrate de que esta ruta sea correcta

interface DropdownFiltroProps {
    // Agregamos '?' para hacerlo opcional por seguridad, aunque siempre deberías pasarlo
    opciones?: { id: string; label: string; color: string | null }[]; 
    filtroActual: string;
    onFiltroChange: (nuevoId: string) => void;
}

// 1. Iniciamos opciones = [] para evitar el error "reading 'find' of undefined"
export default function DropdownFilter({ 
    opciones = [], 
    filtroActual, 
    onFiltroChange 
}: DropdownFiltroProps) {
    
    // Estado para controlar si el menú está abierto o cerrado
    const [isOpen, setIsOpen] = useState(false);

    // NOTA: Eliminé el estado interno 'filtroActivo' y la función 'obtenerNombreFiltro'
    // porque eran redundantes. El componente padre (MonthlyCalendar) ya controla esto.

    // 2. Usamos '?.' (optional chaining) como doble seguridad
    const opcionActual = opciones?.find(op => op.id === filtroActual);
    const labelMostrar = opcionActual ? opcionActual.label : 'Filtrar';

    return(
        <div className="relative">
            {/* Boton principal */}
            <Button 
                className="bg-sidebar-border text-black hover:bg-gray-300"
                onClick={() => setIsOpen(!isOpen)}
            > 
                <Funnel className="mr-2 h-4 w-4" />
                <span>{labelMostrar}</span>
                <ChevronDown className={`h-3 w-3 opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Menú desplegable */}
            {isOpen && (
                <>
                {/* Div invisible para cerrar el menú si se hace click afuera */}
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 p-1 animate-in fade-in zoom-in-95 duration-100">
                    {/* Verificamos que opciones tenga elementos antes de hacer map */}
                    {opciones && opciones.length > 0 ? (
                        opciones.map((opcion) => (
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
                        ))
                    ) : (
                        <div className="p-2 text-sm text-gray-500">No hay opciones</div>
                    )}
                </div>
                </>
            )}
        </div>
    )
}