'use client';

import ChecklistComponent from "@/components/checklist/checklist";
import type { Checklist } from "@/types/checklist.types";
import { useState } from "react";

//DATA Simulada
const MANTENIMIENTO_DATA: Checklist = {
  id: 1,
  titulo: "Mantenimiento de Aire Acondicionado",
  ubicacion: "M1-P01, Módulo 1 Piso 1",
  // Esta lista vendría de tu backend al cargar el detalle
  tareas: [
    { id: 1, nombre: "Revisar filtros", descripcion: "Limpieza profunda", estado: "COMPLETADA" },
    { id: 2, nombre: "Medir voltaje", descripcion: "Verificar entrada 220V", estado: "PENDIENTE" },
    { id: 3, nombre: "Lubricación", descripcion: "Rodamientos del motor", estado: "PENDIENTE" },
    { id: 4, nombre: "Prueba de Sensores", descripcion: "Verificar termostatos", estado: "PENDIENTE" },
  ]
};

const ChecklistPage = () => {
    // Estado para controlar qué vista mostrar
    // false = Muestra el detalle general
    // true = Muestra la pantalla de checklist (tareas)
    const [showChecklist, setShowChecklist] = useState(false);

    return (
        <div>
            <ChecklistComponent checklist={MANTENIMIENTO_DATA} onBack={() => setShowChecklist(false)} // Función para volver 
            />
        </div>
    )
}

export default ChecklistPage;