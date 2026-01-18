import { useState, useEffect, useMemo } from "react";
import DateNavigator from "../ui/dateNavigator";
import DropdownFilter from "../ui/dropdownFilter";
import { MaintenanceSummaryModal } from "@/components/forms/mantenimientos/MaintenanceSummaryModal";
import { InspectionSummaryModal } from "@/components/forms/inspecciones/InspectionSummaryModal";
import { useCalendarioSemanal } from "@/hooks/calendario/useCalendario";

/*Nombres de los meses */
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Nombres de los días de la semana
const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Función para mapear estado a color
const getColorFromEstado = (estado: string): 'grey' | 'blue' | 'yellow' | 'green' => {
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes('no empezado')) return 'grey';
  if (estadoLower.includes('ejecución') || estadoLower.includes('ejecutando')) return 'blue';
  if (estadoLower.includes('reprogramado')) return 'yellow';
  if (estadoLower.includes('culminado') || estadoLower.includes('completado')) return 'green';
  return 'grey';
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
      fullDate: new Date(dayDate), // Guardar fecha completa para comparación
      tareas: []
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

interface WeeklyCalendarProps {
  initialDate?: Date | null;
}

const WeeklyCalendar = ({ initialDate }: WeeklyCalendarProps) => {
  // Estado para la fecha actual (usar initialDate si se proporciona)
  const [currentDate, setCurrentDate] = useState(() => {
    return initialDate || new Date();
  });

  // Estado para el filtro activo
  const [filtroActivo, setFiltroActivo] = useState('todos');

  // Estados para el modal de resumen de mantenimiento
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedMaintenanceData, setSelectedMaintenanceData] = useState<any>(null);

  // Estados para el modal de resumen de inspección
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [selectedInspectionData, setSelectedInspectionData] = useState<any>(null);

  // Actualizar currentDate cuando cambie initialDate
  useEffect(() => {
    if (initialDate) {
      setCurrentDate(initialDate);
    }
  }, [initialDate]);

  // Calcular el inicio y fin de la semana para determinar qué meses cargar
  const startOfWeekDate = new Date(currentDate);
  const currentDayOfWeek = currentDate.getDay();
  const diffToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  startOfWeekDate.setDate(currentDate.getDate() - diffToMonday);

  const endOfWeekDate = new Date(startOfWeekDate);
  endOfWeekDate.setDate(startOfWeekDate.getDate() + 6);

  // Formatear fechas para los hooks
  const startOfWeekStr = startOfWeekDate.toISOString().split('T')[0];
  const endOfWeekStr = endOfWeekDate.toISOString().split('T')[0];

  // Fetch de eventos para el mes del inicio de la semana
  const { data: datosMes1, isLoading: loading1 } = useCalendarioSemanal(startOfWeekStr);

  // Fetch de eventos para el mes del fin de la semana (puede ser el mismo o siguiente)
  const { data: datosMes2, isLoading: loading2 } = useCalendarioSemanal(endOfWeekStr);

  const isLoading = loading1 || loading2;

  // Combinar datos de ambos meses y eliminar duplicados (si los meses son iguales, useCalendarioSemanal maneja caché)
  const inspecciones = useMemo(() => {
    const list1 = datosMes1?.inspecciones || [];
    const list2 = datosMes2?.inspecciones || [];
    // Si los meses son iguales, list1 === list2 (por referencia de query cache si funciona bien, o contenido).
    // Para asegurar, creamos un Map por ID.
    const map = new Map();
    [...list1, ...list2].forEach((item: any) => map.set(item.id || item.idInspeccion, item));
    return Array.from(map.values());
  }, [datosMes1, datosMes2]);

  const mantenimientos = useMemo(() => {
    const list1 = datosMes1?.mantenimientos || [];
    const list2 = datosMes2?.mantenimientos || [];
    const map = new Map();
    [...list1, ...list2].forEach((item: any) => map.set(item.id || item.idMantenimiento, item));
    return Array.from(map.values());
  }, [datosMes1, datosMes2]);

  const eventos = [...inspecciones, ...mantenimientos];

  // Generar datos de la semana basándose en la fecha actual
  const semanaDataBase = generateWeekData(currentDate);


  // Distribuir eventos a los días correspondientes
  const semanaData = useMemo(() => {

    // Helper para obtener fecha local YYYY-MM-DD sin problemas de timezone
    const toLocalDateString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return semanaDataBase.map(dia => {
      const diaDateStr = toLocalDateString(dia.fullDate);

      // 1. Tareas Normales
      const tareasNormales = eventos
        .filter((evento: any) => {
          // Usar el campo correcto según el tipo de evento
          let fechaEvento = '';

          if (evento.idInspeccion) {
            fechaEvento = (evento.fechaCreacion || '').split('T')[0]; // ← Para inspecciones
          } else if (evento.idMantenimiento) {
            fechaEvento = (evento.fechaLimite || '').split('T')[0]; // ← Para mantenimientos
          } else {
            fechaEvento = (evento.fecha || '').split('T')[0];
          }

          return fechaEvento === diaDateStr;
        })
        .map((evento: any) => {
          // Adaptar la estructura del evento a la estructura esperada
          let tipo = '';
          let id = '';
          let titulo = '';

          // Para inspecciones
          if (evento.idInspeccion) {
            tipo = 'inspeccion';
            id = evento.idInspeccion;
            titulo = evento.titulo || evento.nombre || `Inspección ${evento.idInspeccion}`;
          }
          // Para mantenimientos
          else if (evento.idMantenimiento) {
            tipo = 'mantenimiento';
            id = evento.idMantenimiento;
            titulo = evento.titulo || evento.nombre || `Mantenimiento ${evento.idMantenimiento}`;
          }
          // Para eventos con tipo explícito
          else if (evento.tipo) {
            tipo = evento.tipo.toLowerCase();
            id = evento.id || evento.idMantenimiento || evento.idInspeccion;
            titulo = evento.titulo || evento.nombre || `${evento.tipo} ${id}`;
          }

          const tareaMappeada = {
            id: id,
            tipo: tipo,
            titulo: titulo,
            area: evento.ubicacionTecnica || evento.ubicacion || '',
            color: getColorFromEstado(evento.estado || 'no empezado'),
            estado: evento.estado || 'no empezado',
            fechaLimite: evento.fechaLimite || evento.fecha || diaDateStr,
            isProjection: false
          };

          return tareaMappeada;
        });

      // 2. Tareas de Proyección (Ghost Events)
      // 2. Tareas de Proyección (Ghost Events)
      const tareasProyeccion = eventos
        .filter((evento: any) => {
          // Solo si existe fechaProximaGeneracion
          if (!evento.fechaProximaGeneracion) return false;
          // Comparar con el día actual
          const fechaProj = evento.fechaProximaGeneracion.split('T')[0];
          return fechaProj === diaDateStr;
        })
        .map((evento: any) => {
          // Mapeo similar pero marcado como proyección
          let tipo = '';
          let id = '';
          let titulo = '';

          if (evento.idInspeccion) {
            tipo = 'inspeccion';
            id = `ghost-insp-${evento.idInspeccion}`; // ID único temporal
            titulo = `(Proyección) ${evento.titulo || evento.nombre || 'Inspección'}`;
          } else if (evento.idMantenimiento) {
            tipo = 'mantenimiento';
            id = `ghost-mant-${evento.idMantenimiento}`;
            titulo = `(Proyección) ${evento.titulo || evento.nombre || 'Mantenimiento'}`;
          } else {
            tipo = evento.tipo ? evento.tipo.toLowerCase() : 'evento';
            id = `ghost-${evento.id || Math.random()}`;
            titulo = `(Proyección) ${evento.titulo || 'Evento'}`;
          }

          return {
            id: id,
            tipo: tipo,
            titulo: titulo,
            area: evento.ubicacionTecnica || evento.ubicacion || '',
            color: 'grey', // Color base, se sobrescribirá o usará opacidad
            estado: 'Proyección',
            fechaLimite: diaDateStr,
            isProjection: true
          };
        });

      return {
        ...dia,
        tareas: [...tareasNormales, ...tareasProyeccion]
      };
    });
  }, [semanaDataBase, eventos]);

  // Función para filtrar tareas según el filtro activo
  const filtrarTareas = (tareas: any[]) => {

    let tareasFiltradas;
    if (filtroActivo === 'todos') {
      tareasFiltradas = tareas;
    } else if (filtroActivo === 'mantenimientos') {
      tareasFiltradas = tareas.filter(tarea => tarea.tipo === 'mantenimiento');
    } else if (filtroActivo === 'inspecciones') {
      tareasFiltradas = tareas.filter(tarea => tarea.tipo === 'inspeccion');
    } else {
      tareasFiltradas = tareas;
    }



    return tareasFiltradas;
  };

  // Función para manejar el click en una tarea
  const handleTaskClick = (tarea: any, fecha: Date) => {
    // Si es una proyección, no hacer nada
    if (tarea.isProjection) return;

    if (tarea.tipo === 'mantenimiento') {
      // Usar datos básicos de la tarea mientras se carga el resumen

      //Llamar al servicio 
      const basicMaintenanceData = {
        estado: tarea.estado || 'No empezado',
        prioridad: 'Media',
        frecuencia: 'Mensual',
        repeticion: 'Sí',
        ubicacion: tarea.area || 'Ubicación por definir',
        fechaLimite: fecha.toLocaleDateString('es-ES'),
        titulo: tarea.titulo || 'Sin título',
        id: tarea.id // Agregar el ID para el enlace
      };

      setSelectedMaintenanceData(basicMaintenanceData);
      setIsMaintenanceModalOpen(true);

      // El hook se encargará de obtener los datos detallados
      // El modal puede mostrar un estado de carga si es necesario
    } else if (tarea.tipo === 'inspeccion') {
      // TODO: Generar datos reales de la inspección desde el API
      const inspectionData = {
        estado: 'Programado',
        supervisor: 'Por asignar',
        area: 'Por definir',
        frecuencia: 'Mensual',
        ubicacion: tarea.area || 'Ubicación por definir',
        observacion: 'Sin observaciones',
        id: tarea.id
      };
      setSelectedInspectionData(inspectionData);
      setIsInspectionModalOpen(true);
    }
  };

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
  const startOfWeek = new Date(startOfWeekDate); // Usar la fecha calculada arriba

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sumamos 6 días para llegar al domingo

  const label = `Semana ${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${MONTH_NAMES[endOfWeek.getMonth()]}`;

  return (
    <div>
      {/*--- CABECERA DEL CALENDARIO SEMANAL ---*/}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-xl font-bold text-gray-900">{label}</h2>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Filtro de mantenimientos e inspecciones */}
          <DropdownFilter
            filtroActual={filtroActivo}
            onFiltroChange={setFiltroActivo}
          />
          {/* Navegación de Semanas */}
          <DateNavigator label='Semana' onPrev={handlePrevWeek} onNext={handleNextWeek}></DateNavigator>
        </div>
      </div>

      {/* --- GRID DE LA SEMANA --- */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 w-full md:min-w-0 overflow-x-auto">
        {semanaData.map((diaItem, index) => {
          // Filtrar las tareas según el filtro activo
          const tareasFiltradas = filtrarTareas(diaItem.tareas);

          // Calcular la fecha exacta del día
          const dayDate = new Date(currentDate);
          const currentDay = currentDate.getDay();
          const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
          const startOfWeek = new Date(currentDate);
          startOfWeek.setDate(currentDate.getDate() - diffToMonday);
          const exactDate = new Date(startOfWeek);
          exactDate.setDate(startOfWeek.getDate() + index);

          // Verifica si el dia es pasado
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dayToCompare = new Date(exactDate);
          dayToCompare.setHours(0, 0, 0, 0);
          const isPastDay = dayToCompare < today;

          return (
            <div key={index} className="flex flex-col h-full">
              {/* Cabecera de la Columna (Día y Número) */}
              <div className="text-center mb-4">
                <span className={`block text-sm font-bold uppercase tracking-wide ${isPastDay ? 'text-gray-400' : 'text-gray-400'}`}>
                  {diaItem.dia}
                </span>
                {
                  exactDate.toDateString() === new Date().toDateString() ? (
                    <div className="flex justify-center mt-1">
                      <span className="text-3xl font-bold text-gema-green">
                        {diaItem.fecha}
                      </span>
                    </div>
                  ) : (
                    <span className="block text-3xl font-bold text-gray-900 mt-1">
                      {diaItem.fecha}
                    </span>
                  )
                }
              </div>

              {/* Cuerpo de la Columna (El contenedor largo) */}
              <div className={`flex-1 border rounded-2xl min-h-[200px] md:min-h-[500px] flex flex-col gap-3 overflow-hidden ${isPastDay ? 'bg-gema-darkgrey border-gray-300' : 'bg-white border-gray-200'}`}>
                {/* Pill de Conteo (Encabezado gris dentro de la columna) */}
                <div className="bg-gray-200 py-2 text-center relative overflow-hidden">
                  <span className="text-xs font-bold text-gray-700">
                    {filtroActivo === 'todos' ? 'Mantenimientos' :
                      filtroActivo === 'mantenimientos' ? 'Mantenimientos' : 'Inspecciones'} - {tareasFiltradas.length}
                  </span>
                </div>

                {/* Lista de Tarjetas */}
                <div className="flex flex-col gap-3 p-1">
                  {tareasFiltradas.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-8">
                      Sin actividades programadas
                    </div>
                  ) : (
                    tareasFiltradas.map((tarea) => (
                      <div
                        key={tarea.id}
                        onClick={() => handleTaskClick(tarea, exactDate)}
                        className={`
                                relative p-3 rounded-r-xl rounded-l-sm border-l-[6px] shadow-sm transition-opacity
                                ${tarea.isProjection
                            ? 'opacity-40 cursor-default bg-gray-50'
                            : 'cursor-pointer hover:opacity-90 hover:shadow-md hover:scale-[1.02] transition-all'
                          }
                                ${!tarea.isProjection ? cardColors[tarea.color as keyof typeof cardColors] : 'border-l-gray-400'}
                              `}
                      >
                        <h4 className="font-bold text-gray-800 text-base leading-tight mb-1">
                          {tarea.titulo}
                        </h4>
                        {tarea.area && (
                          <p className="text-sm text-gray-600 font-medium">
                            {tarea.area}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
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

      {/* Modal de Resumen de Mantenimiento */}
      <MaintenanceSummaryModal
        open={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        data={selectedMaintenanceData}
        mantenimientoId={selectedMaintenanceData?.id} // Pasar el ID del mantenimiento
      />

      {/* Modal de Resumen de Inspección */}
      <InspectionSummaryModal
        open={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        data={selectedInspectionData}
        inspeccionId={selectedInspectionData?.id}
      />
    </div>
  )
};

export { WeeklyCalendar };