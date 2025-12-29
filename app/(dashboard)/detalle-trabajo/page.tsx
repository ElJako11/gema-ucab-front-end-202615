'use client';

import ChecklistComponent from "@/components/checklist/checklist";
import { useGetAllChecklistItem } from "@/hooks/checklist/useGetAllChecklistItem";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const ChecklistPage = () => {
  //Obtener el ID de la URL (asumiendo ruta dinámica [id])
  //const params = useParams();
  //const id = Number(params.id); // Convertir a número
  const id = 1; // Temporalmente fijo para pruebas 
  const type = "mantenimientos"; // Temporalmente fijo para pruebas

  //Usar el hook para traer los datos del Backend
  const { data: checklist, isLoading, isError } = useGetAllChecklistItem(type,id);

  // Estado para controlar qué vista mostrar
  // false = Muestra el detalle general
  // true = Muestra la pantalla de checklist (tareas)
  const [showChecklist, setShowChecklist] = useState(false);

  //Manejo de estados de carga y error
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gema-green">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    );
  }

  // Si hay error o si la data llegó vacía (undefined)
  if (isError || !checklist) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>No se pudo cargar la información del checklist.</p>
      </div>
    );
  }

  return (
        <div>
            <ChecklistComponent 
              idTrabajo={checklist.idTrabajo}
              checklist={checklist} 
              onBack={() => setShowChecklist(false)} // Función para volver 
            />
        </div>
    )
}

export default ChecklistPage;