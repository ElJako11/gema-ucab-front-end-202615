"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPlantillas } from "@/lib/plantillas";
import { LoaderCircle, ArrowLeft, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { getUbicacionesTecnicas } from "@/lib/api/ubicacionesTecnicas";
import { getGruposDeTrabajo } from "@/services/gruposTrabajo";

export default function PlantillaDetallePage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const [plantilla, setPlantilla] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = () => {
    setGuardando(true);

    // Simular guardado con un delay
    setTimeout(() => {
      setGuardando(false);
      toast.success("Mantenimiento guardado exitosamente");
      router.push('/plantillas');
    }, 1000);
  };

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      setLoading(true);
      try {
        const data = await getPlantillas();
        const found = data?.data?.find((p: any) => String(p.id) === String(idParam));
        if (mounted) setPlantilla(found || null);
      } catch (e) {
        if (mounted) setPlantilla(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetch();
    return () => {
      mounted = false;
    };
  }, [idParam]);

  const [ubicacionesOptions, setUbicacionesOptions] = useState<any[]>([]);
  const [ubicacionTecnica, setUbicacionTecnica] = useState("");
  const [gruposOptions, setGruposOptions] = useState<any[]>([]);
  const [areaEncargada, setAreaEncargada] = useState("");

  // Cargar ubicaciones técnicas para el select
  useEffect(() => {
    let mounted = true;
    async function fetchUbicaciones() {
      try {
        const res = await getUbicacionesTecnicas();
        if (mounted) setUbicacionesOptions(res?.data || []);
      } catch (error) {
        if (mounted) setUbicacionesOptions([]);
      }
    }
    fetchUbicaciones();
    return () => {
      mounted = false;
    };
  }, []);

  // Cargar grupos de trabajo para el select Área encargada
  useEffect(() => {
    let mounted = true;
    async function fetchGrupos() {
      try {
        const res = await getGruposDeTrabajo();
        if (mounted) setGruposOptions(res?.data || []);
      } catch (error) {
        if (mounted) setGruposOptions([]);
      }
    }
    fetchGrupos();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
      </div>
    );
  }

  if (!plantilla) {
    return (
      <div className="p-6 max-w-6xl">
        <Button
          variant="outline"
          onClick={() => router.push('/plantillas')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="text-center text-gray-500">
          Plantilla no encontrada
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl">
      {/* Header con botón de volver */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{plantilla.plantilla}</h1>
          <p className="text-muted-foreground">{plantilla.tipo}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/plantillas')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Plantillas
        </Button>
      </div>

      {/* Formulario de detalles */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header de la tabla/formulario */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-700 uppercase">Detalles del Mantenimiento</h2>
        </div>

        <div className="p-6">
          {/* Primera fila: Estado, Prioridad, Tipo, Instancia */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Estado</label>
              <Select>
                <SelectTrigger className="border-2 border-gray-500 rounded-lg px-3 py-2 bg-gray-100 hover:bg-gray-50 w-full">
                  <SelectValue placeholder="Seleccione estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="culminado">Culminado</SelectItem>
                  <SelectItem value="no_empezado">No empezado</SelectItem>
                  <SelectItem value="reprogramado">Reprogramado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Prioridad</label>
              <Select>
                <SelectTrigger className="border-2 border-gray-500 rounded-lg px-3 py-2 bg-gray-100 hover:bg-gray-50 w-full">
                  <SelectValue placeholder="Seleccione prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tipo</label>
              <Select>
                <SelectTrigger className="border-2 border-gray-500 rounded-lg px-3 py-2 bg-gray-100 hover:bg-gray-50 w-full">
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventivo">Preventivo</SelectItem>
                  <SelectItem value="correctivo">Correctivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Instancia</label>
              <Select>
                <SelectTrigger className="border-2 border-gray-500 rounded-lg px-3 py-2 bg-gray-100 hover:bg-gray-50 w-full">
                  <SelectValue placeholder="Seleccione instancia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instancia_a">Instancia A</SelectItem>
                  <SelectItem value="instancia_b">Instancia B</SelectItem>
                  <SelectItem value="instancia_c">Instancia C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resumen (textarea) */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Resumen</label>
            <textarea
              placeholder="Escriba un resumen del mantenimiento..."
              className="w-full border-2 border-gray-500 rounded-lg p-3 h-32 resize-vertical bg-gray-100 hover:border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Ubicación técnica, Especificación del dispositivo, Área encargada */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Ubicación técnica</label>
              <Select onValueChange={(val) => setUbicacionTecnica(val)}>
                <SelectTrigger className="border-2 border-gray-500 rounded-lg px-3 py-2 bg-gray-100 hover:bg-gray-50 w-full">
                  <SelectValue placeholder="Seleccionar ubicación" />
                </SelectTrigger>
                <SelectContent>
                  {ubicacionesOptions && ubicacionesOptions.length > 0 ? (
                    ubicacionesOptions.map((u: any) => (
                      <SelectItem key={u.idUbicacion} value={String(u.idUbicacion)}>
                        {u.descripcion}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="sin_datos">No hay ubicaciones</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Especificación del dispositivo</label>
              <Select>
                <SelectTrigger className="border-2 border-gray-500 rounded-lg px-3 py-2 bg-gray-100 hover:bg-gray-50 w-full">
                  <SelectValue placeholder="Seleccionar especificación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spec_a">Spec A</SelectItem>
                  <SelectItem value="spec_b">Spec B</SelectItem>
                  <SelectItem value="spec_c">Spec C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Área encargada</label>
              <Select onValueChange={(val) => setAreaEncargada(val)}>
                <SelectTrigger className="border-2 border-gray-500 rounded-lg px-3 py-2 bg-gray-100 hover:bg-gray-50 w-full">
                  <SelectValue placeholder="Seleccionar área" />
                </SelectTrigger>
                <SelectContent>
                  {gruposOptions && gruposOptions.length > 0 ? (
                    gruposOptions.map((g: any) => (
                      <SelectItem key={g.id} value={String(g.id)}>
                        {g.nombre}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="sin_grupos">Sin grupos disponibles</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Programación del mantenimiento */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 uppercase mb-4">Programación del mantenimiento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Fecha de creación</label>
                <input
                  type="date"
                  className="w-full border-2 border-gray-500 rounded-lg px-3 py-2 bg-gray-100 hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Fecha límite</label>
                <input
                  type="date"
                  className="w-full border-2 border-gray-500 rounded-lg px-3 py-2 bg-gray-100 hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Actividades */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 uppercase mb-4">Actividades</h3>
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => router.push(`/plantillas/${idParam}/checklist`)}
            >
              <CirclePlus className="mr-2 h-4 w-4" />
              Agregar Checklist
            </Button>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col md:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => router.push('/plantillas')}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleGuardar}
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );


}
