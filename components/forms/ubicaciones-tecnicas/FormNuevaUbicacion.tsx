'use client'

import * as React from "react";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ComboSelectInput } from "@/components/ui/comboSelectInput";
import { CircleX, Info, LoaderCircle, PlusCircle, Trash } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import * as z from "zod";
import type { UbicacionTecnica } from "@/types/models/ubicacionesTecnicas.types";
import { Combobox } from "@/components/ui/combobox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CreateUbicacionTecnicaRequest } from "@/lib/api/ubicacionesTecnicas";

// ✅ Usar hooks organizados
import {
  useUbicaciones,
  useUbicacionDependientes,
  useUbicacionesPorNivel
} from "@/hooks/ubicaciones-tecnicas/useUbicaciones";
import { useCreateUbicacion } from "@/hooks/ubicaciones-tecnicas/useCreateUbicacion";

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

// ✅ Esquema de validación con Zod
const ubicacionSchema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  abreviacion: z.string()
    .min(1, "Debes definir al menos un nivel para la ubicación (Abreviación).")
    .max(5, "La abreviación no debe ser mayor a 5 caracteres"),
});

// ✅ Helper functions extraídas
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

// ✅ Función de flatten extraída
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

// ✅ Hook personalizado simplificado para niveles
const useUbicacionesNiveles = (formValues: UbicacionTecnicaForm) => {
  const { data: ubicaciones, isLoading } = useUbicaciones();

  // Encontrar ubicaciones seleccionadas por nivel
  const selectedItems = useMemo(() => {
    if (!ubicaciones) return {};

    const flat = flattenUbicaciones(ubicaciones);
    const items: Record<number, UbicacionTecnica | undefined> = {};

    // Nivel 1 - Módulo
    items[1] = flat.find(u => u.abreviacion === formValues.modulo && u.nivel === 1);

    // Construir código progresivamente para encontrar items por nivel
    const buildCode = (level: number) => {
      const fields = ['modulo', 'planta', 'espacio', 'tipo', 'subtipo', 'numero', 'pieza'];
      return fields.slice(0, level).map(field => formValues[field as keyof UbicacionTecnicaForm]).filter(Boolean).join('-');
    };

    for (let level = 2; level <= 7; level++) {
      const code = buildCode(level);
      if (code) {
        items[level] = flat.find(u => u.codigo_Identificacion === code);
      }
    }

    return items;
  }, [ubicaciones, formValues]);

  // Obtener opciones para cada nivel
  const getOptionsForLevel = (level: number) => {
    if (!ubicaciones) return [];

    const flat = flattenUbicaciones(ubicaciones);

    if (level === 1) {
      return flat.filter(u => u.nivel === 1);
    }

    // Para niveles superiores, filtrar por padre
    const parentLevel = level - 1;
    const parent = selectedItems[parentLevel];

    if (!parent) return [];

    return flat.filter(u => u.nivel === level && u.codigo_Identificacion.startsWith(parent.codigo_Identificacion + '-'));
  };

  return {
    ubicaciones,
    isLoading,
    selectedItems,
    getOptionsForLevel
  };
};

const FormNuevaUbicacion: React.FC<Props> = ({
  open,
  onClose,
  formValues,
  setFormValues,
  displayedLevels,
  setDisplayedLevels,
}) => {
  // ✅ Usar hooks organizados
  const { ubicaciones, isLoading, selectedItems, getOptionsForLevel } = useUbicacionesNiveles(formValues);
  const createMutation = useCreateUbicacion();

  // Estados locales
  const [esEquipo, setEsEquipo] = useState(false);
  const [padres, setPadres] = useState<(string | number | null)[]>([null]);

  // ✅ Hook para obtener posibles padres (solo cuando es equipo)
  const { data: posiblesPadresResponse, isLoading: loadingPadres, isError: errorPadres } = useUbicacionesPorNivel(
    displayedLevels > 1 ? displayedLevels - 1 : 1
  );

  const posiblesPadres = posiblesPadresResponse?.data || [];

  // Verificar si el último nivel es válido
  const isLastLevelValid = selectedItems[displayedLevels] !== undefined;

  const closeModal = () => {
    setDisplayedLevels(1);
    setFormValues({
      modulo: "", planta: "", espacio: "", tipo: "", subtipo: "",
      numero: "", pieza: "", descripcion: ""
    });
    setEsEquipo(false);
    setPadres([null]);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Función para resetear niveles superiores
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

  const downloadGuia = () => {
    window.open('/guia-ubicaciones-tecnicas.pdf', '_blank');
  };

  // ✅ Función onSubmit simplificada usando hook
  const onSubmit = () => {
    console.log("🚀 Iniciando envío de formulario de ubicación...");
    if (!ubicaciones) {
      toast.error("Los datos de ubicaciones aún no se han cargado.");
      return;
    }

    // ✅ Validación con Zod
    const abreviacion = getAbreviacion(formValues);
    const validacion = ubicacionSchema.safeParse({
      descripcion: formValues.descripcion,
      abreviacion: abreviacion,
    });

    if (!validacion.success) {
      // ✅ LOGICA DEFENSIVA: Evitamos crash si errors es undefined
      console.error("❌ Fallo validación Zod:", validacion);
      const errors = validacion.error?.errors || [];
      if (Array.isArray(errors) && errors.length > 0) {
        errors.forEach((error) => toast.error(error.message));
      } else {
        toast.error("Error de validación: Verifica que la abreviación no exceda los 5 caracteres.");
      }
      return;
    }

    console.log("📝 Abreviación validada:", abreviacion);

    const flatUbicaciones = flattenUbicaciones(ubicaciones);
    const codigoCompleto = generarCodigo(formValues);
    const partes = codigoCompleto.split("-");
    const codigoSinUltimoNivel = partes.slice(0, -1).join("-");

    const padreFisico = flatUbicaciones.find(u => u.codigo_Identificacion === codigoSinUltimoNivel);

    // Validación de que no estemos intentando crear una ubicación que YA existe como padre
    // Si la abreviación es igual a un padre existente seleccionado, estamos duplicando
    const existeExacto = flatUbicaciones.find(u => u.codigo_Identificacion === codigoCompleto);
    if (existeExacto) {
      console.warn("⚠️ Advertencia: El código generado ya existe localmente:", codigoCompleto);
    }

    const payload: CreateUbicacionTecnicaRequest = {
      descripcion: formValues.descripcion,
      abreviacion: abreviacion, // Usamos la variable ya calculada y validada
      padres: [],
    };

    // Agregar padre físico si existe
    if (padreFisico) {
      payload.padres!.push({
        idPadre: padreFisico.idUbicacion,
        esUbicacionFisica: true,
        estaHabilitado: true
      });
    } else if (partes.length > 1) {
      toast.error(`Error: No se encontró la ubicación padre con código "${codigoSinUltimoNivel}".`);
      return;
    }

    // Agregar padres virtuales si es equipo
    if (esEquipo) {
      const idsPadresVirtuales = padres
        .filter((p) => p !== null)
        .map((id) => ({
          idPadre: Number(id),
          esUbicacionFisica: false,
          estaHabilitado: true
        }));

      for (const p of idsPadresVirtuales) {
        if (!payload.padres!.some(existente => existente.idPadre === p.idPadre)) {
          payload.padres!.push(p);
        }
      }
    }

    console.log("📦 Enviando payload:", payload);

    // ✅ Usar hook de creación
    createMutation.mutate(payload, {
      onSuccess: () => {
        console.log("✅ Creación exitosa");
        closeModal();
        toast.success("Ubicación técnica creada correctamente");
      },
      onError: (error: any) => {
        console.error("❌ Error en mutación:", error);
        // Detectar conflicto (código duplicado)
        if (error?.response?.status === 409 || error?.message?.includes("409")) {
          toast.error("La ubicación técnica ya existe.");
        } else {
          toast.error(error.message || "Error al crear la ubicación técnica");
        }
      }
    });
  };

  const renderNivel = (nivel: number, label: string, campo: keyof UbicacionTecnicaForm, placeholder: string) => {
    if (displayedLevels < nivel) return null;

    const options = getOptionsForLevel(nivel);
    const isLast = displayedLevels === nivel;

    return (
      <div key={nivel}>
        <Label className="text-sm">
          {label}
        </Label>
        <ComboSelectInput
          name={campo}
          placeholder={isLoading ? "Cargando..." : placeholder}
          value={formValues[campo]}
          onChange={(value) => {
            setFormValues(prev => ({
              ...prev,
              [campo]: value,
              // Resetear niveles superiores
              ...Object.fromEntries(
                ['planta', 'espacio', 'tipo', 'subtipo', 'numero', 'pieza']
                  .slice(nivel - 1)
                  .map(campo => [campo, ""])
              )
            }));

            // ✅ AUTO-EXPANDIR: Si seleccionamos un item existente, mostrar el siguiente nivel automáticamente
            const existe = options.some(o => o.abreviacion === value);
            if (existe && nivel < 7) {
              setDisplayedLevels(prev => Math.max(prev, nivel + 1));
            }
          }}
          options={options.map((u) => ({
            value: u.abreviacion,
            label: `${u.abreviacion} - ${u.descripcion}`,
          }))}
          disabled={isLoading}
          className="w-full border rounded p-2"
        />
      </div>
    );
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      className="bg-white"
      contentClassName="space-y-2"
      title={
        <div className="flex items-center gap-1">
          <span className="text-xl font-semibold">Crear Ubicación Técnica</span>
          <Tooltip >
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={downloadGuia} aria-label="Descargar guía de ubicaciones técnicas">
                <Info />
              </Button>
            </TooltipTrigger>
            <TooltipContent ><span>Ver guía de ubicaciones técnicas</span></TooltipContent>
          </Tooltip>
        </div>
      }
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="space-y-2">

          {/* Nivel 1 */}
          <div>
            <Label className="text-sm">
              Nivel 1 <span className="text-red-500">*</span>
            </Label>
            <ComboSelectInput
              name="modulo"
              placeholder={isLoading ? "Cargando..." : "Ejemplo: M2"}
              value={formValues.modulo}
              onChange={(value) => {
                setFormValues(prev => ({
                  ...prev,
                  modulo: value,
                  planta: "", espacio: "", tipo: "", subtipo: "", numero: "", pieza: ""
                }));
                // ✅ AUTO-EXPANDIR NIVEL 1
                const options = ubicaciones?.filter((u) => u.nivel === 1) || [];
                const existe = options.some(o => o.abreviacion === value);
                if (existe) {
                  setDisplayedLevels(prev => Math.max(prev, 2));
                }
              }}
              options={ubicaciones?.filter((u) => u.nivel === 1).map((u) => ({
                value: u.abreviacion,
                label: `${u.abreviacion} - ${u.descripcion}`,
              })) || []}
              disabled={isLoading}
              className="w-full border rounded p-2"
            />
          </div>

          {/* ✅ CORREGIDO: Niveles renderizados dinámicamente con auto-expansión */}
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

        <div className="space-y-4">
          <div>
            <Label htmlFor="descripcion">Descripción <span className="text-red-500">*</span></Label>
            <Input name="descripcion" placeholder="Ejemplo: Módulo 2, Planta 1, Aula A2-14"
              value={formValues.descripcion} onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div className="bg-slate-200 p-4 pt-3 rounded-sm">
            <span className="text-sm font-semibold">Vista previa del código:</span>
            <div className="p-2 rounded border-2 border-neutral-300 font-mono text-sm">
              {generarCodigo(formValues) || <span className="text-gray-400 italic">Completa los niveles...</span>}
            </div>
          </div>

          <div className="space-y-2">
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
                  {loadingPadres ? <LoaderCircle className="animate-spin h-5 w-5" />
                    : errorPadres ? <p className="text-red-600 text-sm">Error al cargar ubicaciones.</p>
                      : (
                        <>
                          {padres.filter((p) => p !== null).map((p) => posiblesPadres.find((ubicacion: UbicacionTecnica) => ubicacion.idUbicacion == p)).map((ubicacion: UbicacionTecnica | undefined) => (
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
                            data={posiblesPadres.filter((ubicacion: UbicacionTecnica) => !generarCodigo(formValues).includes(ubicacion.codigo_Identificacion) && !padres.includes(String(ubicacion.idUbicacion))).map((ubicacion: UbicacionTecnica) => ({
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

      {createMutation.isError && <p className="text-red-600 text-sm">{createMutation.error instanceof Error ? createMutation.error.message : "Error al crear la ubicación técnica, por favor intente de nuevo."}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={closeModal} className="px-4 md:px-8">Cancelar</Button>
        <Button className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground px-4 md:px-8" onClick={onSubmit} disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creando..." : "Crear Ubicación"}
        </Button>
      </div>
    </Modal>
  );
};

export default FormNuevaUbicacion;