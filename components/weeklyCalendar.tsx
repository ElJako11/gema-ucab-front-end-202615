import { ChevronLeft, ChevronRight } from "lucide-react";

/* Data Simulada */
const semanaData = [
  { 
    dia: "Lun", fecha: 3, 
    tareas: [
      { id: 1, titulo: "Revisión Grama", area: "Áreas Verdes", color: "grey" },
      { id: 2, titulo: "Revisión Baño", area: "Mod. 4 Piso 2", color: "grey" }
    ] 
  },
  { 
    dia: "Mar", fecha: 4, 
    tareas: [
      { id: 3, titulo: "Revisión Poste", area: "Esc. Ing Industrial", color: "blue" }
    ] 
  },
  { 
    dia: "Mié", fecha: 5, 
    tareas: [
      { id: 4, titulo: "Revisión Poste", area: "Esc. Ing Industrial", color: "yellow" },
      { id: 5, titulo: "Revisión A/A", area: "", color: "green" }, // Tarjeta pequeña
      { id: 6, titulo: "Revisión Grama", area: "Áreas Verdes", color: "green" }
    ] 
  },
  { 
    dia: "Jue", fecha: 6, 
    tareas: [
      { id: 7, titulo: "Revisión Grama", area: "", color: "green" }
    ] 
  },
  { 
    dia: "Vie", fecha: 7, 
    tareas: [
      { id: 8, titulo: "Revisión Grama", area: "Áreas Verdes", color: "green" }
    ] 
  },
  { dia: "Sab", fecha: 8, tareas: [] },
  { dia: "Dom", fecha: 9, tareas: [] },
];

//Tipos de colores para las tarjetas
const cardColors = {
  grey: "border-l-gema-darkgrey bg-gema-darkgrey/20",
  blue: "border-l-gema-blue bg-gema-blue/20",
  yellow: "border-l-gema-yellow bg-gema-yellow/20",
  green: "border-l-gema-green bg-gema-green/20",
};

const WeeklyCalendar = () => {
    return(
        <div>
            {/*--- CABECERA DEL CALENDARIO SEMANAL ---*/}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-xl font-bold text-gray-900">Semana del 3 de Noviembre</h2>
                
                {/* Navegación de Semanas */}
                <div className="flex items-center gap-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button className="h-10 px-6 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 font-medium text-gray-700 transition-colors">
                    Semanas
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
                </div>
            </div>

            {/* --- GRID DE LA SEMANA --- */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-w-[1000px] md:min-w-0 overflow-x-auto">
              {semanaData.map((diaItem, index) => (
                <div key={index} className="flex flex-col h-full">
                    
                  {/* Cabecera de la Columna (Día y Número) */}
                  <div className="text-center mb-4">
                    <span className="block text-sm font-bold text-gray-400 uppercase tracking-wide">
                      {diaItem.dia}
                    </span>
                    <span className="block text-3xl font-bold text-gray-900 mt-1">
                      {diaItem.fecha}
                    </span>
                  </div>

                  {/* Cuerpo de la Columna (El contenedor largo) */}
                  <div className="flex-1 border border-gray-200 rounded-2xl min-h-[500px] bg-white flex flex-col gap-3 overflow-hidden">
                    
                  {/* Pill de Conteo (Encabezado gris dentro de la columna) */}
                  <div className="bg-gray-200 py-2 text-center relative overflow-hidden">
                    {/* Simulación del degradado superior en la tarjeta del Martes (opcional) */}
                    {index === 1 && (
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-gema-yellow via-gema-blue to-gema-green" />
                    )}
                    <span className="text-xs font-bold text-gray-700">
                      Mantenimientos - {diaItem.tareas.length}
                    </span>
                  </div>

                  {/* Lista de Tarjetas */}
                  <div className="flex flex-col gap-3 p-1">
                    {diaItem.tareas.map((tarea) => (
                      <div
                        key={tarea.id}
                          className={`
                          relative p-3 rounded-r-xl rounded-l-sm border-l-[6px] shadow-sm cursor-pointer hover:opacity-90 transition-opacity
                          ${cardColors[tarea.color as keyof typeof cardColors]}
                        `}
                      >
                        <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">
                          {tarea.titulo}
                        </h4>
                        {tarea.area && (
                          <p className="text-xs text-gray-600 font-medium">
                            {tarea.area}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6 w-full">
      
      {/* Título */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Estados de Mantenimientos e Inspecciones
      </h3>

      {/* Contenedor de los items (Fila flexible) */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Item 1: No empezado (Gris) */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-gema-darkgrey" />
          <span className="text-sm font-medium text-gray-700">No empezado</span>
        </div>

        {/* Item 2: En ejecución (Azul) */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-gema-blue" /> {/* O usa bg-gema-blue */}
          <span className="text-sm font-medium text-gray-700">En ejecución</span>
        </div>

        {/* Item 3: Reprogramado (Amarillo/Ámbar) */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-gema-yellow" /> {/* O usa bg-gema-yellow */}
          <span className="text-sm font-medium text-gray-700">Reprogramado</span>
        </div>

        {/* Item 4: Culminado (Verde) */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-gema-green" /> {/* O usa bg-gema-green */}
          <span className="text-sm font-medium text-gray-700">Culminado</span>
        </div>

      </div>
    </div>
    </div>
  )
};

export { WeeklyCalendar };