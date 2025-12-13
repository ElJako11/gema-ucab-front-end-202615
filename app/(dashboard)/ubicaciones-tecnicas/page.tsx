'use client'

import React, { useState, useEffect, useMemo } from "react";
import {
  CirclePlus,
  Building,
  LoaderCircle,
  Trash,
  FileSpreadsheet
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FormNuevaUbicacion from "@/components/forms/ubicaciones-tecnicas/FormNuevaUbicacion";
import { Button } from "@/components/ui/button";
import EditUbicacionForm from "@/components/forms/ubicaciones-tecnicas/EditUbicacionForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import type {
  UbicacionTecnica,
  PadreUbicacion,
} from "@/types/models/ubicacionesTecnicas.types";
import VerManualDialog from "@/components/VerManualDialog";
import { UbicacionHierarchy } from "./components/UbicacionHierarchy";
import { UbicacionesFilters } from "./components/UbicacionesFilters";
import { NIVELES, type Filters } from "./components/constants";
import { DialogTitle } from "@/components/ui/dialog";

// ✅ Imports de hooks organizados
import { 
  useUbicaciones, 
  useUbicacionPadres, 
  useUbicacionDependientes 
} from "@/hooks/ubicaciones-tecnicas/useUbicaciones";
import { useCreateUbicacion } from "@/hooks/ubicaciones-tecnicas/useCreateUbicacion";
import { useUpdateUbicacion } from "@/hooks/ubicaciones-tecnicas/useUpdateUbicacion";
import { useDeleteUbicacion } from "@/hooks/ubicaciones-tecnicas/useDeleteUbicacion";

export default function UbicacionesTecnicasPage() {
  // =================== HOOKS DE ESTADO LOCAL ===================
  
  // Estados para modales
  const [ubicacionParaEditar, setUbicacionParaEditar] = useState<UbicacionTecnica | null>(null);
  const [open, setOpen] = useState(false);
  const [borrarUbicacion, setBorrarUbicacion] = useState<UbicacionTecnica | null>(null);
  const [verDetalle, setVerDetalle] = useState<UbicacionTecnica | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  // Estados para filtros
  const [filters, setFilters] = useState<Filters>({
    modulo: "",
    planta: "",
    espacio: "",
    tipo: "",
    subtipo: "",
    numero: "",
    pieza: "",
  });

  // Estados para formulario
  const [formValues, setFormValues] = useState({
    modulo: "",
    planta: "",
    espacio: "",
    tipo: "",
    subtipo: "",
    numero: "",
    pieza: "",
    descripcion: "",
  });

  const [displayedLevels, setDisplayedLevels] = useState<number>(1);

  // ✅ localStorage en useEffect
  useEffect(() => {
    const hasLoaded = localStorage.getItem("haCargadoUbicaciones");
    setManualOpen(!hasLoaded);
  }, []);

  // ✅ Manejo del manual
  const handleManualClose = (isOpen: boolean) => {
    if (!isOpen) {
      try {
        localStorage.setItem("haCargadoUbicaciones", "true");
      } catch (error) {
        console.error("Error al guardar en localStorage:", error);
      }
      setManualOpen(false);
    } else {
      setManualOpen(true);
    }
  };

  // =================== HOOKS DE API ===================
  
  // ✅ Usando hooks organizados
  const { data, error, isLoading } = useUbicaciones();
  const { data: padresData, isLoading: isLoadingPadres } = useUbicacionPadres(verDetalle?.idUbicacion);
  const dependencias = useUbicacionDependientes(borrarUbicacion?.idUbicacion);
  
  // ✅ Hooks de mutación
  const createMutation = useCreateUbicacion();
  const updateMutation = useUpdateUbicacion();
  const deleteMutation = useDeleteUbicacion();

  // =================== HOOKS DE LÓGICA LOCAL ===================
  
  const initializeFormValues = (codigo: string) => {
    console.log("🔧 Inicializando formulario desde código:", codigo);
    
    const nivelesExtraidos = codigo.split("-");
    console.log("📋 Niveles extraídos:", nivelesExtraidos);
    
    const valoresIniciales = { ...formValues };
    let levelAmount = 0;
    
    NIVELES.forEach((nivel, index) => {
      const valor = nivelesExtraidos[index] || "";
      valoresIniciales[nivel] = valor;
      if (valor) levelAmount++;
      console.log(`📝 Nivel ${index + 1} (${nivel}): "${valor}"`);
    });
    
    const newDisplayedLevels = Math.min(levelAmount + 1, NIVELES.length);
    
    console.log("🎯 Configuración final:", {
      valoresIniciales,
      levelAmount,
      newDisplayedLevels,
      abrirModal: true
    });
    
    setFormValues(valoresIniciales);
    setDisplayedLevels(newDisplayedLevels);
    setOpen(true);
  };

  // Hook personalizado para manejar la jerarquía y filtrado
  const { flatUbicaciones, filteredData } = useMemo(() => {
    if (!data) return { flatUbicaciones: [], filteredData: [] };

    // Aplanar ubicaciones
    const flatten = (nodes: UbicacionTecnica[]): UbicacionTecnica[] => {
      let list: UbicacionTecnica[] = [];
      for (const node of nodes) {
        const withoutChildren = { ...node } as any;
        if (withoutChildren.children) delete withoutChildren.children;
        list.push(withoutChildren as UbicacionTecnica);
        if (node.children && node.children.length > 0) {
          list = list.concat(flatten(node.children));
        }
      }
      return list;
    };

    const flatUbicaciones = flatten(data);

    // Filtrar datos
    if (!Object.values(filters).some(Boolean)) {
      return { flatUbicaciones, filteredData: data };
    }

    const filterTree = (nodes: UbicacionTecnica[]): UbicacionTecnica[] => {
      return nodes.reduce((acc, node) => {
        const children = node.children ? filterTree(node.children) : [];
        const parts = node.codigo_Identificacion.split("-");
        const selfMatch = NIVELES.every(
          (nivel, idx) => !filters[nivel] || parts[idx] === filters[nivel]
        );

        if (selfMatch || children.length > 0) {
          acc.push({ ...node, children });
        }
        return acc;
      }, [] as UbicacionTecnica[]);
    };

    const filteredData = filterTree(data);

    return { flatUbicaciones, filteredData };
  }, [data, filters]);



  const countChildren = (node: UbicacionTecnica): number => {
    if (!node.children || node.children.length === 0) return 0;
    return (
      node.children.length +
      node.children.reduce((sum, child) => sum + countChildren(child), 0)
    );
  };

  // ✅ Exportación simplificada
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

      // ⚠️ TEMPORAL: Esto se refactorizará en FASE 2
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;

      if (!baseUrl) {
        toast.error("Backend URL no configurada");
        return;
      }

      if (!token) {
        toast.error("Token de autenticación no encontrado");
        return;
      }

      const url = `${baseUrl}/ubicaciones-tecnicas/export/excel`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al descargar el archivo");

      const blob = await response.blob();

      // Obtener nombre del archivo
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "ubicaciones.xlsx";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Exportación completada");
    } catch (error) {
      console.error("Error en la exportación a Excel:", error);
      toast.error("No se pudo exportar a Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  // =================== HANDLERS ===================
  
  const handleEditarClick = (detalle: UbicacionTecnica | null) => {
    setUbicacionParaEditar(detalle);
  };

  const handleCerrarEditar = () => {
    setUbicacionParaEditar(null);
    // Los hooks ya manejan la invalidación automáticamente
  };

  const handleDeleteUbicacion = () => {
    if (borrarUbicacion) {
      deleteMutation.mutate(borrarUbicacion.idUbicacion, {
        onSuccess: () => {
          setBorrarUbicacion(null);
        }
      });
    }
  };

  if (isLoading)
    return (
      <div className="p-6 text-center">
        <LoaderCircle className="animate-spin mx-auto" />
      </div>
    );

  if (error) return <div className="p-6 text-red-600">Error al obtener ubicaciones técnicas</div>;

  return (
    <div className="p-4 sm:p-6 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Ubicaciones Técnicas</h1>

      <VerManualDialog
        open={manualOpen}
        onOpenChange={handleManualClose}
      />

      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gema-green/80 hover:bg-gema-green"
              onClick={() => {
                // Limpiar formulario para nueva ubicación desde cero
                setFormValues({
                  modulo: "", planta: "", espacio: "", tipo: "", 
                  subtipo: "", numero: "", pieza: "", descripcion: ""
                });
                setDisplayedLevels(1);
                console.log("🆕 Creando nueva ubicación desde cero");
              }}
            >
              <CirclePlus className="mr-2 h-4 w-4" />
              Crear nueva ubicación
            </Button>
          </DialogTrigger>
          <FormNuevaUbicacion
            open={open}
            onClose={() => setOpen(false)}
            formValues={formValues}
            setFormValues={setFormValues}
            displayedLevels={displayedLevels}
            setDisplayedLevels={setDisplayedLevels}
          />
        </Dialog>
        <Button
          className="bg-gema-blue/80 hover:bg-gema-blue "
          onClick={handleExportExcel}
          disabled={isExporting}
        >
          {isExporting ? (
            <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4" />
          )}
          {isExporting ? "Exportando..." : "Exportar a Excel"}
        </Button>
      </div>

      {/* Diálogo para ver detalles de la ubicación */}
      <Dialog
        open={!!verDetalle}
        onOpenChange={(isOpen) => !isOpen && setVerDetalle(null)}
      >
        <DialogContent className="max-w-2xl bg-white w-[95vw] sm:w-full">
          <div className="space-y-4">
            <DialogTitle>Detalles de la Ubicación</DialogTitle>

            {verDetalle && (
              <div className="space-y-3">
                <div className="text-sm wrap-break-word">
                  <span className="font-medium">Código:</span> {verDetalle.codigo_Identificacion}
                </div>
                <div className="text-sm wrap-break-word">
                  <span className="font-medium">Descripción:</span> {verDetalle.descripcion}
                </div>
              </div>
            )}
            <h3 className="font-semibold text-md">Padres</h3>
            {isLoadingPadres ? (
              <div className="flex justify-center">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : padresData && typeof padresData === 'object' && 'data' in padresData && Array.isArray(padresData.data) && padresData.data.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {padresData.data.map((padre: PadreUbicacion) => (
                  <div
                    key={padre.idUbicacion}
                    className="text-sm p-3 border border-border rounded-lg bg-gray-50"
                  >
                    <div className="font-medium wrap-break-word">{padre.codigo_Identificacion}</div>
                    <div className="text-gray-600 wrap-break-word">{padre.descripcion}</div>
                    {padre.esUbicacionFisica && (
                      <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        Ubicación Física
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 py-4">
                Esta ubicación no tiene padres asignados.
              </p>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setVerDetalle(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar ubicación */}
      <Dialog
        open={!!borrarUbicacion}
        onOpenChange={(open) => {
          if (!open) setBorrarUbicacion(null);
        }}
      >
        <DialogContent className="max-w-2xl bg-white w-[95vw] sm:w-full">
          <div className="space-y-4">
            <DialogTitle>
              ¿Seguro que desea eliminar esta ubicación técnica?
            </DialogTitle>

            <div className="space-y-3 p-4 border border-border rounded-lg bg-gray-50">
              <div className="text-sm wrap-break-word">
                <span className="font-medium">Nombre:</span> {borrarUbicacion?.descripcion}
              </div>
              <div className="text-sm wrap-break-word">
                <span className="font-medium">Código:</span> {borrarUbicacion?.codigo_Identificacion}
              </div>
            </div>

            <p className="text-sm text-gray-700">
              Esto eliminará la ubicación y todas las ubicaciones dependientes:
            </p>

            {dependencias.isLoading ? (
              <div className="flex justify-center py-4">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : dependencias.data?.data.length ? (
              <div className="max-h-40 overflow-y-auto space-y-2">
                {dependencias.data.data.map((dep: UbicacionTecnica) => (
                  <div
                    key={dep.idUbicacion}
                    className="text-sm p-2 border border-border rounded bg-white wrap-break-word"
                  >
                    {dep.descripcion} ({dep.codigo_Identificacion})
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 py-4">
                No hay ubicaciones dependientes.
              </p>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4 sm:gap-0">
              <Button
                className="bg-gema-blue hover:bg-blue-500 text-black w-full sm:w-auto"
                onClick={handleExportExcel}
                disabled={isExporting || deleteMutation.isPending}
              >
                {isExporting ? (
                  <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                )}
                {isExporting ? "Exportando..." : "Guardar respaldo"}
              </Button>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-[70%]">
                <Button
                  variant="outline"
                  onClick={() => setBorrarUbicacion(null)}
                  disabled={deleteMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 text-black w-full sm:w-auto"
                  onClick={handleDeleteUbicacion}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    <Trash className="mr-2 h-4 w-4" />
                  )}
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de edición */}
      {ubicacionParaEditar && (
        <EditUbicacionForm
          open={!!ubicacionParaEditar}
          onClose={handleCerrarEditar}
          idUbicacion={ubicacionParaEditar.idUbicacion}
          descripcionOriginal={ubicacionParaEditar.descripcion}
        />
      )}

      {/* Filtros por niveles */}
      <UbicacionesFilters
        filters={filters}
        setFilters={setFilters}
        flatUbicaciones={flatUbicaciones}
      />

      {/* Lista de ubicaciones */}
      <Accordion
        type="single"
        collapsible
        className="w-full bg-white rounded-lg border border-border"
      >
        {filteredData.map((ubicacion) => (
          <AccordionItem
            key={ubicacion.idUbicacion}
            value={ubicacion.codigo_Identificacion}
            className="border-b border-border last:border-b-0"
          >
            <AccordionTrigger className="bg-desplegable-background/80 hover:bg-desplegable-background border-b border-border px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full">
                <div className="flex items-center gap-2">
                  <Building className="text-blue-600 w-5 h-5 shrink-0" />
                  <span className="text-base sm:text-lg font-semibold text-left break-all">
                    {ubicacion.codigo_Identificacion}
                  </span>
                </div>
                <span className="bg-gray-300 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                  {1 + countChildren(ubicacion)} ubicaciones
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0  overflow-x-auto max-w-[85vw] sm:max-w-full">
              <div className="min-w-[600px] sm:min-w-0">
                <UbicacionHierarchy
                  ubicaciones={[ubicacion]}
                  onCreateFrom={initializeFormValues}
                  onDelete={setBorrarUbicacion}
                  onViewDetails={setVerDetalle}
                  onEdit={handleEditarClick}
                  activeDetailItem={verDetalle}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {filteredData.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white">
          No se encontraron ubicaciones técnicas
        </div>
      )}
    </div>
  );
}