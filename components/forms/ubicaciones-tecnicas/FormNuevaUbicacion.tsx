// components/features/ubicaciones/form-nueva-ubicacion.tsx - VERSIÓN FINAL CORREGIDA
'use client'

import * as React from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ComboSelectInput } from "@/components/ui/comboSelectInput";
import { ubicacionesAPI } from "@/lib/api/ubicacionesTecnicas";
import { CircleX, Info, LoaderCircle, PlusCircle, Trash } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import type { UbicacionTecnica } from "@/types/models/ubicacionesTecnicas.types";
import { Combobox } from "@/components/ui/combobox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ubicacionTecnicaSchema } from "@/lib/validations/ubicacionTecnicaSchema";
import type {
  CreateUbicacionTecnicaPayload,
  CreateUbicacionResponse
} from "@/types/api/api";

type UbicacionTecnicaForm = {
  modulo: string;
  planta: string;
  espacio: string;
  tipo: string;
  subtipo: string;
  numero: string;
  pieza: string;
  descripcion: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  formValues: UbicacionTecnicaForm;
  setFormValues: React.Dispatch<React.SetStateAction<UbicacionTecnicaForm>>;
  displayedLevels: number;
  setDisplayedLevels: React.Dispatch<React.SetStateAction<number>>;
}

function useUbicacionesNiveles(formValues: UbicacionTecnicaForm) {
  const { data: ubicacionesData, isLoading } = useQuery({
    queryKey: ["ubicacionesTecnicas"],
    queryFn: ubicacionesAPI.getUbicacionesTecnicas,
  });

  const selectedNivel1 = ubicacionesData?.data?.find(u => u.abreviacion === formValues.modulo);

  const { data: dependientesNivel2, isLoading: loadingNivel2 } = useQuery({
    queryKey: ["ubicacionesDependientes", selectedNivel1?.idUbicacion, 2],
    queryFn: () => selectedNivel1 ? ubicacionesAPI.getUbicacionesDependientes(selectedNivel1.idUbicacion, 2) : Promise.resolve({ data: [] }),
    enabled: !!selectedNivel1,
  });

  const selectedNivel2 = dependientesNivel2?.data?.find(u => u.abreviacion === formValues.planta);
  const { data: dependientesNivel3, isLoading: loadingNivel3 } = useQuery({
    queryKey: ["ubicacionesDependientes", selectedNivel2?.idUbicacion, 3],
    queryFn: () => selectedNivel2 ? ubicacionesAPI.getUbicacionesDependientes(selectedNivel2.idUbicacion, 3) : Promise.resolve({ data: [] }),
    enabled: !!selectedNivel2,
  });

  const selectedNivel3 = dependientesNivel3?.data?.find(u => u.abreviacion === formValues.espacio);
  const { data: dependientesNivel4, isLoading: loadingNivel4 } = useQuery({
    queryKey: ["ubicacionesDependientes", selectedNivel3?.idUbicacion, 4],
    queryFn: () => selectedNivel3 ? ubicacionesAPI.getUbicacionesDependientes(selectedNivel3.idUbicacion, 4) : Promise.resolve({ data: [] }),
    enabled: !!selectedNivel3,
  });

  const selectedNivel4 = dependientesNivel4?.data?.find(u => u.abreviacion === formValues.tipo);
  const { data: dependientesNivel5, isLoading: loadingNivel5 } = useQuery({
    queryKey: ["ubicacionesDependientes", selectedNivel4?.idUbicacion, 5],
    queryFn: () => selectedNivel4 ? ubicacionesAPI.getUbicacionesDependientes(selectedNivel4.idUbicacion, 5) : Promise.resolve({ data: [] }),
    enabled: !!selectedNivel4,
  });

  const selectedNivel5 = dependientesNivel5?.data?.find(u => u.abreviacion === formValues.subtipo);
  const { data: dependientesNivel6, isLoading: loadingNivel6 } = useQuery({
    queryKey: ["ubicacionesDependientes", selectedNivel5?.idUbicacion, 6],
    queryFn: () => selectedNivel5 ? ubicacionesAPI.getUbicacionesDependientes(selectedNivel5.idUbicacion, 6) : Promise.resolve({ data: [] }),
    enabled: !!selectedNivel5,
  });

  const selectedNivel6 = dependientesNivel6?.data?.find(u => u.abreviacion === formValues.numero);
  const { data: dependientesNivel7, isLoading: loadingNivel7 } = useQuery({
    queryKey: ["ubicacionesDependientes", selectedNivel6?.idUbicacion, 7],
    queryFn: () => selectedNivel6 ? ubicacionesAPI.getUbicacionesDependientes(selectedNivel6.idUbicacion, 7) : Promise.resolve({ data: [] }),
    enabled: !!selectedNivel6,
  });

  return {
    ubicacionesData,
    isLoading,
    dependientes: {
      2: { data: dependientesNivel2?.data, loading: loadingNivel2, selected: selectedNivel2 },
      3: { data: dependientesNivel3?.data, loading: loadingNivel3, selected: selectedNivel3 },
      4: { data: dependientesNivel4?.data, loading: loadingNivel4, selected: selectedNivel4 },
      5: { data: dependientesNivel5?.data, loading: loadingNivel5, selected: selectedNivel5 },
      6: { data: dependientesNivel6?.data, loading: loadingNivel6, selected: selectedNivel6 },
      7: { data: dependientesNivel7?.data, loading: loadingNivel7 }
    },
    selectedItems: {
      1: selectedNivel1,
      2: selectedNivel2,
      3: selectedNivel3,
      4: selectedNivel4,
      5: selectedNivel5,
      6: selectedNivel6
    }
  };
}

// ✅ CORREGIDO: Helper functions extraídas
const generarCodigo = (formValues: UbicacionTecnicaForm) => {
  const { modulo, planta, espacio, tipo, subtipo, numero, pieza } = formValues;
  const niveles = [modulo, planta, espacio, tipo, subtipo, numero, pieza];
  const resultado: string[] = [];
  for (let i = 0; i < niveles.length; i++) {
    if (!niveles[i].trim()) break;
    resultado.push(niveles[i]);
  }
  return resultado.join("-");
};

const getAbreviacion = (formValues: UbicacionTecnicaForm) => {
  const { modulo, planta, espacio, tipo, subtipo, numero, pieza } = formValues;
  const levels = [modulo, planta, espacio, tipo, subtipo, numero, pieza];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (levels[i].trim() !== "") return levels[i];
  }
  return "";
};

// ✅ CORREGIDO: Función de flatten extraída
const flattenUbicaciones = (nodes: UbicacionTecnica[]): UbicacionTecnica[] => {
  let list: UbicacionTecnica[] = [];
  for (const node of nodes) {
    const { children, ...rest } = node;
    list.push(rest as UbicacionTecnica);
    if (children && children.length > 0) {
      list = list.concat(flattenUbicaciones(children));
    }
  }
  return list;
};

const FormNuevaUbicacion: React.FC<Props> = ({
  open,
  onClose,
  formValues,
  setFormValues,
  displayedLevels,
  setDisplayedLevels,
}) => {
  const queryClient = useQueryClient();

  // ✅ CORREGIDO: Usar custom hook
  const { ubicacionesData, isLoading, dependientes, selectedItems } = useUbicacionesNiveles(formValues);

  // ✅ CORREGIDO: Lógica de último nivel válido simplificada
  const isLastLevelValid = selectedItems[displayedLevels as keyof typeof selectedItems] !== undefined;

  const [esEquipo, setEsEquipo] = React.useState(false);
  const [padres, setPadres] = React.useState<(string | number | null)[]>([null]);

  const closeModal = () => {
    setDisplayedLevels(1);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ CORREGIDO: Función para resetear niveles superiores
  const resetNivelesSuperiores = (nivelInicio: number) => {
    setFormValues(prev => {
      const nuevosValores = { ...prev };
      const campos = ['planta', 'espacio', 'tipo', 'subtipo', 'numero', 'pieza'];

      for (let i = nivelInicio - 1; i < campos.length; i++) {
        nuevosValores[campos[i] as keyof UbicacionTecnicaForm] = "";
      }

      return nuevosValores;
    });
  };

  // ✅ CORREGIDO: useMutation con tipos explícitos para resolver el error
  const mutation = useMutation({
    mutationFn: ubicacionesAPI.createUbicacionTecnica,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["ubicacionesTecnicas"] });
      toast.success(data.data?.message || "Ubicación creada exitosamente");
      onClose();
      setFormValues({
        modulo: "", planta: "", espacio: "", tipo: "", subtipo: "",
        numero: "", pieza: "", descripcion: ""
      });
      setDisplayedLevels(1);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear la ubicación técnica");
    },
  });

  const posiblesPadres = useQuery({
    queryFn: () => ubicacionesAPI.getUbicacionesPorNivel(displayedLevels - 1),
    queryKey: ["ubicacionesPorNivel", displayedLevels - 1],
    enabled: displayedLevels > 1 && esEquipo,
  });

  const downloadGuia = () => {
    window.open('/guia-ubicaciones-tecnicas.pdf', '_blank');
  };

  // ✅ CORREGIDO: Función onSubmit más limpia
  const onSubmit = () => {
    if (!ubicacionesData?.data) {
      toast.error("Los datos de ubicaciones aún no se han cargado.");
      return;
    }

    const flatUbicaciones = flattenUbicaciones(ubicacionesData.data);
    const codigoCompleto = generarCodigo(formValues);
    const partes = codigoCompleto.split("-");
    const codigoSinUltimoNivel = partes.slice(0, -1).join("-");

    const padreFisico = flatUbicaciones.find(u => u.codigo_Identificacion === codigoSinUltimoNivel);

    const payload: CreateUbicacionTecnicaPayload = {
      descripcion: formValues.descripcion,
      abreviacion: getAbreviacion(formValues),
      padres: [],
    };

    if (padreFisico) {
      payload.padres!.push({ idPadre: padreFisico.idUbicacion, esUbicacionFisica: true });
    } else if (partes.length > 1) {
      toast.error(`Error: No se encontró la ubicación padre con código "${codigoSinUltimoNivel}".`);
      return;
    }

    if (esEquipo) {
      const idsPadresVirtuales = padres
        .filter((p) => p !== null)
        .map((id) => ({ idPadre: Number(id), esUbicacionFisica: false }));

      for (const p of idsPadresVirtuales) {
        if (!payload.padres!.some(existente => existente.idPadre === p.idPadre)) {
          payload.padres!.push(p);
        }
      }
    }

    const validationResult = ubicacionTecnicaSchema.safeParse(payload);
    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => toast.error(issue.message)); // ← .issues en lugar de .errors
      return;
    }

    mutation.mutate(payload);
  };

  const renderNivel = (nivel: number, label: string, campo: keyof UbicacionTecnicaForm, placeholder: string) => {
    if (displayedLevels < nivel) return null;

    const dependiente = dependientes[nivel as keyof typeof dependientes];

    return (
      <div>
        <Label className="text-sm">{label}</Label>
        <ComboSelectInput
          name={campo}
          placeholder={dependiente?.loading ? "Cargando..." : placeholder}
          value={formValues[campo]}
          onChange={(value) => {
            setFormValues(prev => ({
              ...prev,
              [campo]: value,
              ...Object.fromEntries(
                ['planta', 'espacio', 'tipo', 'subtipo', 'numero', 'pieza']
                  .slice(nivel)
                  .map(campo => [campo, ""])
              )
            }))
          }}
          options={dependiente?.data?.map((u) => ({
            value: u.abreviacion,
            label: `${u.abreviacion} - ${u.descripcion}`,
          })) || []}
          disabled={dependiente?.loading}
          className="w-full border border-border rounded p-2"
        />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" bg-white" contentClassName="space-y-2">
        <div className="flex items-center gap-1">
          <DialogTitle className="text-xl font-semibold">Crear Ubicación Técnica</DialogTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={downloadGuia} aria-label="Descargar guía de ubicaciones técnicas">
                <Info />
              </Button>
            </TooltipTrigger>
            <TooltipContent><span>Ver guía de ubicaciones técnicas</span></TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="space-y-2">
            {/* Nivel 1 */}
            <div>
              <Label className="text-sm">Nivel 1 <span className="text-red-500">*</span></Label>
              <ComboSelectInput
                name="modulo"
                placeholder={isLoading ? "Cargando..." : "Ejemplo: M2"}
                value={formValues.modulo}
                onChange={(value) => resetNivelesSuperiores(2)}
                options={ubicacionesData?.data?.filter((u) => u.nivel === 1).map((u) => ({
                  value: u.abreviacion,
                  label: `${u.abreviacion} - ${u.descripcion}`,
                })) || []}
                disabled={isLoading}
                className="w-full border border-border rounded p-2"
              />
            </div>

            {/* ✅ CORREGIDO: Niveles renderizados dinámicamente */}
            {renderNivel(2, "Nivel 2", "planta", "Ejemplo: P01")}
            {renderNivel(3, "Nivel 3", "espacio", "Ejemplo: A2-14, LABBD")}
            {renderNivel(4, "Nivel 4", "tipo", "Ejemplo: HVAC")}
            {renderNivel(5, "Nivel 5", "subtipo", "Ejemplo: SPLIT, CENT")}
            {renderNivel(6, "Nivel 6", "numero", "Ejemplo: 01")}
            {renderNivel(7, "Nivel 7", "pieza", "Ejemplo: COMP, EVAP")}

            <div className="flex flex-col md:flex-row gap-2 mt-1">
              {displayedLevels >= 2 && (
                <Button className="flex-1 border border-red-500 text-red-700 hover:text-red-800" variant="outline"
                  onClick={() => {
                    setDisplayedLevels((prev) => Math.max(prev - 1, 1));
                    resetNivelesSuperiores(displayedLevels);
                  }}>
                  <Trash /> Eliminar último nivel
                </Button>
              )}
              {displayedLevels < 7 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex-1" tabIndex={0}>
                      <Button className="w-full border-gema-green text-gema-green/80 hover:text-gema-green" variant="outline"
                        onClick={() => setDisplayedLevels((prev) => prev + 1)} disabled={!isLastLevelValid}>
                        <PlusCircle /> Agregar nivel
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!isLastLevelValid && <TooltipContent><p>Debes seleccionar una ubicación ya existente para poder agregar un nivel.</p></TooltipContent>}
                </Tooltip>
              )}
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <Label htmlFor="descripcion">Descripción <span className="text-red-500">*</span></Label>
              <Input name="descripcion" placeholder="Ejemplo: Módulo 2, Planta 1, Aula A2-14"
                value={formValues.descripcion} onChange={handleChange} className="w-full border border-border rounded p-2" />
            </div>

            <div className="bg-slate-200 p-4 pt-3 rounded-sm">
              <span className="text-sm font-semibold">Vista previa del código:</span>
              <div className="p-2 rounded border-2 border-neutral-300 font-mono text-sm">
                {generarCodigo(formValues)}
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <Switch id="agregar-padres" checked={esEquipo} onCheckedChange={setEsEquipo} />
                <Label htmlFor="agregar-padres" className="text-sm text-neutral-700">¿Es un equipo?</Label>
              </div>

              {esEquipo && (
                <>
                  <p className="text-sm text-neutral-700">
                    Si aplica, indica los espacios donde el equipo brinda servicio, además de su ubicación física
                  </p>
                  <div className="space-y-2">
                    {posiblesPadres.isLoading ? <LoaderCircle className="animate-spin h-5 w-5" />
                      : posiblesPadres.isError ? <p className="text-red-600 text-sm">Error al cargar ubicaciones.</p>
                        : (
                          <>
                            {padres.filter((p) => p !== null).map((p) => posiblesPadres.data?.data.find(ubicacion => ubicacion.idUbicacion == p)).map((ubicacion) => (
                              <div key={ubicacion?.idUbicacion} className="flex space-x-3 items-center bg-slate-200 rounded px-2 mb-3">
                                <span className="text-sm text-neutral-700">{ubicacion?.codigo_Identificacion}</span>
                                <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-slate-100 px-1"
                                  onClick={() => setPadres((prev) => prev.filter(id => id != ubicacion?.idUbicacion))}>
                                  <CircleX />
                                </Button>
                              </div>
                            ))}
                            <Combobox
                              triggerClassName="w-4/5" contentClassName="w-full"
                              data={posiblesPadres.data?.data.filter(ubicacion => !generarCodigo(formValues).includes(ubicacion.codigo_Identificacion) && !padres.includes(String(ubicacion.idUbicacion))).map((ubicacion) => ({
                                value: ubicacion.idUbicacion, label: `${ubicacion.codigo_Identificacion} - ${ubicacion.descripcion}`,
                              })) || []}
                              value={padres.at(-1) || null}
                              onValueChange={(ubicacion) => setPadres((prev) => [...prev.filter((p) => p !== null), ubicacion, null])}
                            />
                          </>
                        )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {mutation.isError && <p className="text-red-600 text-sm">{mutation.error instanceof Error ? mutation.error.message : "Error al crear la ubicación técnica, por favor intente de nuevo."}</p>}

        <div className="flex  justify-end gap-2">
          <Button variant="outline" onClick={closeModal} className="px-4 md:px-8">Cancelar</Button>
          <Button className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground px-4 md:px-8" onClick={onSubmit} disabled={status === "pending" || mutation.isPending}>
            {status === "pending" ? "Creando..." : "Crear Ubicación"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormNuevaUbicacion;