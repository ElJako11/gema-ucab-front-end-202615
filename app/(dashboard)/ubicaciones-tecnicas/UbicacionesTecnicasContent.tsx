'use client'

import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CirclePlus,
  Building,
  LoaderCircle,
  Trash,
  CornerDownRight,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Pencil,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FormNuevaUbicacion from "@/components/forms/ubicaciones-tecnicas/FormNuevaUbicacion";
import { Button } from "@/components/ui/button";
import EditUbicacionForm from "@/components/forms/ubicaciones-tecnicas/EditUbicacionForm";

import {
  deleteUbicacionTecnica,
  getUbicacionesDependientes,
  getUbicacionesTecnicas,
  getPadresDeUbicacion,
} from "@/lib/api/ubicacionesTecnicas";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VerManualDialog from "@/components/VerManualDialog";


const NIVELES = [
  "modulo",
  "planta",
  "espacio",
  "tipo",
  "subtipo",
  "numero",
  "pieza",
] as const;

type Nivel = (typeof NIVELES)[number];
type Filters = Record<Nivel, string>;

// Componente recursivo para renderizar la jerarquía de ubicaciones
const UbicacionHierarchy: React.FC<{
  ubicaciones: UbicacionTecnica[];
  onCreateFrom: (codigo: string) => void;
  onDelete: (detalle: UbicacionTecnica) => void;
  onViewDetails: (detalle: UbicacionTecnica | null) => void;
  onEdit: (detalle: UbicacionTecnica | null) => void;
  activeDetailItem: UbicacionTecnica | null;
}> = ({
  ubicaciones,
  onCreateFrom,
  onDelete,
  onViewDetails,
  onEdit,
  activeDetailItem,
}) => {
    return (
      <>
        {ubicaciones.map((ubicacion) => {
          const isViewing =
            activeDetailItem?.idUbicacion === ubicacion.idUbicacion;
          return (
            <div key={ubicacion.idUbicacion}>
              <div className="flex px-4 py-2 bg-white hover:bg-gray-50 items-center">
                <div className="flex-1 flex flex-row items-center gap-2">
                  <div style={{ paddingLeft: `${(ubicacion.nivel - 1) * 20}px` }}>
                    {ubicacion.nivel > 1 && (
                      <CornerDownRight size={18} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-mono font-semibold text-sm">
                      {ubicacion.codigo_Identificacion}
                    </p>
                    <p className="text-sm text-gray-700">
                      {ubicacion.descripcion}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1 ml-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-blue-600 !px-2"
                        aria-label={isViewing ? "Cerrar detalles" : "Ver detalles"}
                        onClick={() =>
                          onViewDetails(isViewing ? null : ubicacion)
                        }
                      >
                        {isViewing ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>
                        {isViewing ? "Cerrar detalles" : "Ver detalles"}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-gray-500 !px-2"
                        aria-label="Crear ubicación desde esta"
                        onClick={() =>
                          onCreateFrom(ubicacion.codigo_Identificacion)
                        }
                      >
                        <CirclePlus size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Crear ubicación a partir de esta</span>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-yellow-600 !px-2 hover:text-yellow-700"
                        aria-label="Editar descripción"
                        onClick={() => onEdit(ubicacion)}
                      >
                        <Pencil size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Editar descripción</span>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-red-500 !px-2 hover:text-red-600"
                        aria-label="Eliminar ubicación"
                        onClick={() => onDelete(ubicacion)}
                      >
                        <Trash size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Eliminar ubicación</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              {ubicacion.children && ubicacion.children.length > 0 && (
                <UbicacionHierarchy
                  ubicaciones={ubicacion.children}
                  onCreateFrom={onCreateFrom}
                  onDelete={onDelete}
                  onViewDetails={onViewDetails}
                  onEdit={onEdit}
                  activeDetailItem={activeDetailItem}
                />
              )}
            </div>
          );
        })}
      </>
    );
  };

const UbicacionesTecnicas: React.FC = () => {
  // Estados para modales
  const [ubicacionParaEditar, setUbicacionParaEditar] =
    useState<UbicacionTecnica | null>(null);
  const [open, setOpen] = useState(false);
  const [borrarUbicacion, setBorrarUbicacion] =
    useState<UbicacionTecnica | null>(null);
  const [verDetalle, setVerDetalle] = useState<UbicacionTecnica | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  // ✅ CORREGIDO: localStorage en useEffect
  useEffect(() => {
    const hasLoaded = localStorage.getItem("haCargadoUbicaciones");
    setManualOpen(!hasLoaded);
  }, []);

  // ✅ CORREGIDO: Manejo mejorado del manual
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

  const { data: padresData, isLoading: isLoadingPadres } = useQuery({
    queryKey: ["padresUbicacion", verDetalle?.idUbicacion],
    queryFn: () =>
      verDetalle
        ? getPadresDeUbicacion(verDetalle.idUbicacion)
        : Promise.resolve({
          data: [],
          success: true
        }),
    enabled: !!verDetalle,
  });

  const dependencias = useQuery({
    queryFn: () =>
      getUbicacionesDependientes(borrarUbicacion?.idUbicacion || 0),
    queryKey: ["ubicacionesDependientes", borrarUbicacion?.idUbicacion],
    enabled: !!borrarUbicacion,
  });

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

  const initializeFormValues = (codigo: string) => {
    const nivelesExtraidos = codigo.split("-");
    const valoresIniciales = { ...formValues };
    let levelAmount = 0;
    NIVELES.forEach((nivel, index) => {
      valoresIniciales[nivel] = nivelesExtraidos[index] || "";
      if (nivelesExtraidos[index]) levelAmount++;
    });
    setFormValues(valoresIniciales);
    setDisplayedLevels(Math.min(levelAmount + 1, NIVELES.length));
    setOpen(true);
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["ubicacionesTecnicas"],
    queryFn: getUbicacionesTecnicas,
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUbicacionTecnica,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ubicacionesTecnicas"] });
      setBorrarUbicacion(null);
      toast.success("Ubicación técnica eliminada correctamente");
    },
    onError: () => toast.error("Error al eliminar ubicación técnica"),
  });

  const [filters, setFilters] = useState<Filters>({
    modulo: "",
    planta: "",
    espacio: "",
    tipo: "",
    subtipo: "",
    numero: "",
    pieza: "",
  });

  const flatUbicaciones = React.useMemo(() => {
    if (!data?.data) return [];
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
    return flatten(data.data);
  }, [data]);

  const getOptions = (nivel: Nivel, prevFilters: Filters) => {
    let ubicaciones = flatUbicaciones;
    for (let i = 0; i < NIVELES.length; i++) {
      const n = NIVELES[i];
      if (n === nivel) break;
      if (prevFilters[n as Nivel]) {
        ubicaciones = ubicaciones.filter(
          (u) =>
            (u.codigo_Identificacion.split("-")[i] || "") === prevFilters[n as Nivel]
        );
      }
    }
    const idx = NIVELES.indexOf(nivel as (typeof NIVELES)[number]);
    return Array.from(
      new Set(
        ubicaciones.map((u) => u.codigo_Identificacion.split("-")[idx] || "")
      )
    ).filter(Boolean);
  };

  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];
    if (!Object.values(filters).some(Boolean)) return data.data;

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

    return filterTree(data.data);
  }, [data, filters]);

  const countChildren = (node: UbicacionTecnica): number => {
    if (!node.children || node.children.length === 0) return 0;
    return (
      node.children.length +
      node.children.reduce((sum, child) => sum + countChildren(child), 0)
    );
  };

  // ✅ CORREGIDO: Exportación simplificada
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

  const handleEditarClick = (detalle: UbicacionTecnica | null) => {
    setUbicacionParaEditar(detalle);
  };

  const handleCerrarEditar = () => {
    setUbicacionParaEditar(null);
    queryClient.invalidateQueries({ queryKey: ["ubicacionesTecnicas"] });
  };

  if (isLoading)
    return (
      <div className="p-6 text-center">
        <LoaderCircle className="animate-spin mx-auto" />
      </div>
    );

  if (error) return <div className="p-6 text-red-600">Error al obtener ubicaciones técnicas</div>;

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Ubicaciones Técnicas</h1>

      <VerManualDialog
        open={manualOpen}
        onOpenChange={handleManualClose}
      />

      <div className="flex gap-2 mb-6">
        <Dialog open={open && !manualOpen} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gema-green hover:bg-green-700">
              <CirclePlus className="mr-2 h-4 w-4" />
              Crear nueva ubicación
            </Button>
          </DialogTrigger>
          <FormNuevaUbicacion
            open={open && !manualOpen}
            onClose={() => setOpen(false)}
            formValues={formValues}
            setFormValues={setFormValues}
            displayedLevels={displayedLevels}
            setDisplayedLevels={setDisplayedLevels}
          />
        </Dialog>
        <Button
          className="bg-gema-blue hover:bg-blue-500"
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
        <DialogContent className="max-w-2xl">
          <div className="space-y-4">
            <h2 className="font-semibold text-lg text-center">
              Detalles de la Ubicación
            </h2>
            {verDetalle && (
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Código:</span> {verDetalle.codigo_Identificacion}
                </div>
                <div className="text-sm">
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
                    className="text-sm p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="font-medium">{padre.codigo_Identificacion}</div>
                    <div className="text-gray-600">{padre.descripcion}</div>
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
        <DialogContent className="max-w-2xl">
          <div className="space-y-4">
            <h2 className="font-semibold text-lg text-center">
              ¿Seguro que desea eliminar esta ubicación técnica?
            </h2>

            <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <div className="text-sm">
                <span className="font-medium">Nombre:</span> {borrarUbicacion?.descripcion}
              </div>
              <div className="text-sm">
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
                    className="text-sm p-2 border rounded bg-white"
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

            <div className="flex justify-between items-center pt-4">
              <Button
                className="bg-gema-blue hover:bg-blue-500 text-white"
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

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setBorrarUbicacion(null)}
                  disabled={deleteMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (borrarUbicacion) {
                      deleteMutation.mutate(borrarUbicacion.idUbicacion);
                    }
                  }}
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
      {flatUbicaciones.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Filtrar por niveles:</p>
          <div className="flex flex-wrap gap-3">
            {NIVELES.map((nivel, idx) => {
              if (idx > 0 && !filters[NIVELES[idx - 1]]) return null;
              const opciones = getOptions(nivel, filters);
              if (!opciones.length) return null;
              return (
                <Select
                  value={filters[nivel]}
                  key={nivel}
                  onValueChange={(value) => {
                    setFilters((prev) => {
                      const updated = { ...prev };
                      updated[nivel] = value;
                      for (let i = idx + 1; i < NIVELES.length; i++)
                        updated[NIVELES[i]] = "";
                      return updated;
                    });
                  }}
                >
                  <SelectTrigger className="bg-white w-40">
                    <SelectValue placeholder={`Nivel ${idx + 1}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {opciones.map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            })}
            {Object.values(filters).some(Boolean) && (
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    modulo: "",
                    planta: "",
                    espacio: "",
                    tipo: "",
                    subtipo: "",
                    numero: "",
                    pieza: "",
                  })
                }
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Lista de ubicaciones */}
      <Accordion
        type="single"
        collapsible
        className="w-full bg-white rounded-lg border shadow-sm"
      >
        {filteredData.map((ubicacion) => (
          <AccordionItem
            key={ubicacion.idUbicacion}
            value={ubicacion.codigo_Identificacion}
            className="border-b last:border-b-0"
          >
            <AccordionTrigger className="hover:bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <Building className="text-blue-600 w-5 h-5" />
                <span className="text-lg font-semibold text-left">
                  {ubicacion.codigo_Identificacion}
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {1 + countChildren(ubicacion)} ubicaciones
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2">
              <UbicacionHierarchy
                ubicaciones={[ubicacion]}
                onCreateFrom={initializeFormValues}
                onDelete={setBorrarUbicacion}
                onViewDetails={setVerDetalle}
                onEdit={handleEditarClick}
                activeDetailItem={verDetalle}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {filteredData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron ubicaciones técnicas
        </div>
      )}
    </div>
  );
};

export default UbicacionesTecnicas;