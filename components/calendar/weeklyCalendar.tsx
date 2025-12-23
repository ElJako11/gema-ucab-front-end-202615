import { useState } from "react";
import DateNavigator from "../ui/dateNavigator";

/*Nombres de los meses */
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Nombres de los días de la semana
const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Tipos de tareas simuladas
const TASK_TYPES = [
  { titulo: "Revisión Grama", area: "Áreas Verdes" },
  { titulo: "Revisión Baño", area: "Mod. 4 Piso 2" },
  { titulo: "Revisión Poste", area: "Esc. Ing Industrial" },
  { titulo: "Revisión A/A", area: "" },
  { titulo: "Mantenimiento Bomba", area: "Planta Baja" },
  { titulo: "Inspección Eléctrica", area: "Piso 3" },
  { titulo: "Limpieza Filtros", area: "Azotea" }
];

const TASK_COLORS = ["grey", "blue", "yellow", "green"];

// Función para generar tareas simuladas para un día específico
const generateMockTasks = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  // Usar una función determinística para generar tareas consistentes
  const seed = day + month * 31 + year * 365;
  const random = Math.sin(seed) * 10000;
  const value = Math.abs(random - Math.floor(random));
  
  const tasks = [];
  const numTasks = Math.floor(value * 4); // 0-3 tareas por día
  
  for (let i = 0; i < numTasks; i++) {
    const taskSeed = seed + i * 100;
    const taskRandom = Math.abs(Math.sin(taskSeed) * 10000 - Math.floor(Math.sin(taskSeed) * 10000));
    
    const taskIndex = Math.floor(taskRandom * TASK_TYPES.length);
    const colorIndex = Math.floor((taskRandom * 1000) % TASK_COLORS.length);
    
    tasks.push({
      id: `${day}-${month}-${year}-${i}`,
      titulo: TASK_TYPES[taskIndex].titulo,
      area: TASK_TYPES[taskIndex].area,
      color: TASK_COLORS[colorIndex]
    });
  }
  
  return tasks;
};

// Función para generar los datos de la semana dinámicamente
const generateWeekData = (currentDate: Date) => {
  // Calcular el inicio de la semana (lunes)
  const startOfWeek = new Date(currentDate);
  const currentDay = currentDate.getDay();
  const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
  startOfWeek.setDate(currentDate.getDate() - diffToMonday);
  
  const weekData = [];
  
  // Generar datos para cada día de la semana (Lun-Dom)
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);
    
    // Ajustar el orden para que empiece en Lunes
    const dayIndex = (i + 1) % 7; // 1,2,3,4,5,6,0 -> Lun,Mar,Mié,Jue,Vie,Sáb,Dom
    const dayName = dayIndex === 0 ? "Dom" : DAYS_OF_WEEK[dayIndex];
    
    weekData.push({
      dia: dayName,
      fecha: dayDate.getDate(),
      tareas: generateMockTasks(dayDate)
    });
  }
  
  return weekData;
};

//Tipos de colores para las tarjetas
const cardColors = {
  grey: "border-l-gema-darkgrey bg-gema-darkgrey/20",
  blue: "border-l-gema-blue bg-gema-blue/20",
  yellow: "border-l-gema-yellow bg-gema-yellow/20",
  green: "border-l-gema-green bg-gema-green/20",
};

const WeeklyCalendar = () => {
    // Estado para la fecha actual (mes y semana)
    const [currentDate, setCurrentDate] = useState(new Date());

    // Generar datos de la semana basándose en la fecha actual
    const semanaData = generateWeekData(currentDate);

    // Lógica específica de la SEMANA: sumar/restar 7 días
    const handlePrevWeek = () => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    };

    // Formateo para mostrar rango de semana (simplificado)
    const startOfWeek = new Date(currentDate);
    
    // Asumiendo LUNES como inicio de semana
    const currentDay = currentDate.getDay(); // 0 es Domingo, 1 es Lunes...
    // Si es domingo (0), queremos restar 6 días para llegar al lunes anterior.
    // Si es cualquier otro día, restamos (día - 1).
    const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    startOfWeek.setDate(currentDate.getDate() - diffToMonday);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sumamos 6 días para llegar al domingo

    const label = `Semana ${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${MONTH_NAMES[endOfWeek.getMonth()]}`;

    return(
        <div>
            {/*--- CABECERA DEL CALENDARIO SEMANAL ---*/}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-xl font-bold text-gray-900">{label}</h2>
                
                {/* Navegación de Semanas */}
                <DateNavigator label='Semana' onPrev={handlePrevWeek} onNext={handleNextWeek}></DateNavigator>
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
                    {/* Simulación del degradado superior en días con múltiples tareas */}
                    {diaItem.tareas.length > 2 && (
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
          <div className="h-5 w-5 rounded bg-gema-blue" /> 
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