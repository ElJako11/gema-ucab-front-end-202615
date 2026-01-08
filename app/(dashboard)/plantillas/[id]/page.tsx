"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPlantillas } from "@/lib/plantillas";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CirclePlus, CheckCircle2, Circle, Download, ClipboardPen, Trash2 } from "lucide-react";
import FormNuevaActividad from "@/components/forms/plantillas/FormNuevaActividad";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function ChecklistPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const [title, setTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actividades, setActividades] = useState(actividadesEjemplo);

  const totalActividades = actividades.length;
  const completadas = actividades.filter(a => a.completada).length;
  const pendientes = actividades.filter(a => !a.completada).length;

  const toggleActividad = (id: number) => {
    setActividades(prev =>
      prev.map(a => a.id === id ? { ...a, completada: !a.completada } : a)
    );
  };

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      try {
        const data = await getPlantillas();
        const found = data?.data?.find((p: any) => String(p.id) === String(idParam));
        if (mounted) setTitle(found?.plantilla || "");
      } catch (e) {
        if (mounted) setTitle("");
      }
    }
    fetch();
    return () => {
      mounted = false;
    };
  }, [idParam]);

  const [editingActivity, setEditingActivity] = useState<any>(null);

  const handleEdit = (actividad: any) => {
    setEditingActivity(actividad);
    setIsModalOpen(true);
  };

  const handleSaveActividad = (data: { nombre: string; descripcion?: string }) => {
    if (editingActivity) {
      // Editar existente
      setActividades(prev => prev.map(a =>
        a.id === editingActivity.id
          ? { ...a, ...data }
          : a
      ));
      setEditingActivity(null);
    } else {
      // Crear nueva
      const newId = actividades.length > 0 ? Math.max(...actividades.map(a => a.id)) + 1 : 1;
      setActividades(prev => [...prev, {
        id: newId,
        nombre: data.nombre,
        descripcion: data.descripcion || "",
        completada: false
      }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exportar
        </Button>
      </div>
      <h1 className="text-2xl font-bold">Checklist — {title || "(sin título)"}</h1>
      <p className="text-sm text-gray-600 mt-2">Aquí irá el formulario del checklist.</p>

      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold">Progreso del mantenimiento</h2>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${totalActividades > 0 ? (completadas / totalActividades) * 100 : 0}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{completadas} de {totalActividades} actividades completadas</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Lista de Actividades</h3>
        </div>
        <div>
          <Button
            className="bg-gema-green hover:bg-green-700"
            onClick={() => {
              setEditingActivity(null);
              setIsModalOpen(true);
            }}
          >
            <CirclePlus className="mr-2 h-4 w-4" />
            Nueva actividad
          </Button>
        </div>
      </div>

      {/* Lista de actividades */}
      <div className="mt-4 space-y-3">
        {actividades.map((actividad) => (
          <div
            key={actividad.id}
            className={`bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 ${actividad.completada ? 'opacity-75' : ''}`}
          >
            <div
              className="cursor-pointer"
              onClick={() => toggleActividad(actividad.id)}
            >
              {actividad.completada ? (
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${actividad.completada ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {actividad.nombre}
              </p>
              <p className="text-sm text-gray-500">{actividad.descripcion}</p>
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-1 border-2 border-gray-200 rounded-sm hover:bg-gray-100"
                    onClick={() => handleEdit(actividad)}
                  >
                    <ClipboardPen className="h-5 w-5 text-blue-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Editar tarea</span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-1 border-2 border-gray-200 rounded-sm hover:bg-gray-100"
                    onClick={() => setActividades(prev => prev.filter(a => a.id !== actividad.id))}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Borrar tarea</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600 font-medium">Total</p>
          <p className="text-2xl font-bold mt-2 text-cyan-500">{totalActividades}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600 font-medium">Completadas</p>
          <p className="text-2xl font-bold mt-2 text-green-500">{completadas}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600 font-medium">Pendientes</p>
          <p className="text-2xl font-bold mt-2 text-red-500">{pendientes}</p>
        </div>
      </div>

      <FormNuevaActividad
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveActividad}
        initialData={editingActivity}
      />
    </div>
  );
}
