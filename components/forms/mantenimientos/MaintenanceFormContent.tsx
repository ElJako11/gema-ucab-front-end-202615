import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { mantenimientoSchema } from "@/lib/validations/mantenimientoSchema";
import { useCreateMantenimiento } from "@/hooks/mantenimientos/useCreateMantenimientos";
import { useUbicacionesLista } from "@/hooks/ubicaciones-tecnicas/useUbicaciones";
import { Combobox } from "@/components/ui/combobox";
import { useSupervisores } from "@/hooks/usuarios/useUsuarios";
import { useGrupos } from "@/hooks/grupos-trabajo/useGrupoTrabajo";

const AREA_OPTIONS = ["Electricidad", "Infraestructura", "Mecanica", "Refrigeracion", "Logistica"] as const;

type MantenimientoFormData = z.infer<typeof mantenimientoSchema>;

interface MaintenanceFormContentProps {
    initialValues?: Partial<MantenimientoFormData>;
    onClose?: () => void;
    onSuccess?: () => void;
    maintenanceId?: number;
    maintenanceName?: string;
}

export const MaintenanceFormContent: React.FC<MaintenanceFormContentProps> = ({
    initialValues,
    onClose,
    onSuccess,
    maintenanceId,
    maintenanceName
}) => {


    const createMantenimientoMutation = useCreateMantenimiento();
    const { data: ubicaciones, isLoading: isLoadingUbicaciones } = useUbicacionesLista();
    const { supervisores } = useSupervisores();
    const { data: grupos } = useGrupos();


    const form = useForm<MantenimientoFormData>({
        resolver: zodResolver(mantenimientoSchema),
        defaultValues: {
            titulo: initialValues?.titulo || '',
            prioridad: initialValues?.prioridad || 'Media',
            estado: initialValues?.estado || 'no_empezado',
            supervisor: initialValues?.supervisor || '',
            fechaCreacion: initialValues?.fechaCreacion || '',
            fechaLimite: initialValues?.fechaLimite || '',
            tipoMantenimiento: initialValues?.tipoMantenimiento || 'Periodico',
            repeticion: initialValues?.repeticion || 'unico',
            frecuencia: initialValues?.frecuencia,
            codigoVerificacion: initialValues?.codigoVerificacion || '',
            codigoArea: initialValues?.codigoArea || 1,
            areaEncargada: initialValues?.areaEncargada || undefined,
            resumen: initialValues?.resumen || ''
        }
    });

    const tipoMantenimiento = form.watch("tipoMantenimiento");

    // eliminar array de encargados hardcoded

    const onSubmit = (data: MantenimientoFormData) => {
        
        console.log("Form Data Submitted:", data);
        // Mapear los datos del formulario al formato que espera el backend
        const mantenimientoData = {
            
            nombre: maintenanceName || data.titulo,
            tipoTrabajo: "Mantenimiento" as const,
            fechaCreacion: new Date().toISOString(),
            codigoVerificacion: data.codigoVerificacion,
            codigoArea: data.codigoArea,
            supervisorId: supervisores?.find(s => s.nombre === data.supervisor)?.id || 0, // Buscar ID del supervisor seleccionado
            prioridad: data.prioridad,
            areaEncargada: data.areaEncargada,
            fechaLimite: data.fechaLimite,
            frecuencia: data.frecuencia || "Mensual",
            tipoMantenimiento: data.tipoMantenimiento,
            repeticion: data.tipoMantenimiento === 'Periodico' ? 'periodico' : 'unico',
            estado: 'no_empezado' as const, // Default
            resumen: data.resumen
        };

console.log("Submitting Mantenimiento Data:", mantenimientoData);

        createMantenimientoMutation.mutate(mantenimientoData, {
            onSuccess: () => {
                form.reset();
                onSuccess?.();
                onClose?.();
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
            }
        });
    };

    const onError = (errors: any) => {
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4 text-left">
                {/* Nombre del mantenimiento */}
                <div className="col-span-2">
                    <FormField
                        control={form.control}
                        name="titulo"
                    render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Mantenimiento preventivo de aires acondicionados" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Ubicación Técnica */}
                <div className="col-span-2">
                    <FormField
                        control={form.control}
                        name="codigoVerificacion"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Ubicación Técnica</FormLabel>
                                <FormControl>
                                    <Combobox
                                        data={ubicaciones?.map(u => ({
                                            value: u.codigo_Identificacion,
                                            label: `${u.codigo_Identificacion} - ${u.descripcion}`
                                        })) || []}
                                        value={field.value || null}
                                        onValueChange={(value) => field.onChange(value || 0)}
                                        placeholder={isLoadingUbicaciones ? "Cargando ubicaciones..." : "Seleccionar ubicación técnica"}
                                        searchPlaceholder="Buscar ubicación..."
                                        triggerClassName="w-full"
                                        contentClassName="w-full"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6 my-2">
                    {/* Prioridad */}
                    <FormField
                        control={form.control}
                        name="prioridad"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prioridad</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar prioridad" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Baja">Baja</SelectItem>
                                        <SelectItem value="Media">Media</SelectItem>
                                        <SelectItem value="Alta">Alta</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Área encargada */}
                    <FormField
                        control={form.control}
                        name="areaEncargada"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Área encargada</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ?? null}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar área encargada" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent >
                                        {AREA_OPTIONS.map((area) => (
                                            <SelectItem key={area} value={area}>
                                                {area}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    {/* Grupo de Trabajo */}
                    <FormField
                      control={form.control}
                      name="codigoArea"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Grupo de Trabajo</FormLabel>
                          <FormControl>
                            <Combobox
                              data={grupos?.map((grupo: any) => ({
                                value: grupo.codigo,
                                label: `${grupo.nombre} (${grupo.codigo})`,
                              })) || []}
                              value={field.value ? String(field.value) : null}
                              onValueChange={(val) => field.onChange(val ? Number(val) : 0)}
                              placeholder="Seleccionar grupo"
                              searchPlaceholder="Buscar grupo..."
                              triggerClassName="w-full"
                              contentClassName="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Supervisor */}
                    <FormField
                        control={form.control}
                        name="supervisor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Supervisor Asignado</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar supervisor" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {supervisores?.map((supervisor: any) => (
                                            <SelectItem key={supervisor.Id} value={supervisor.Nombre}>
                                                {supervisor.Nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Fecha de inicio */}
                    <FormField
                        control={form.control}
                        name="fechaCreacion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de inicio</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Fecha de finalización */}
                    <FormField
                        control={form.control}
                        name="fechaLimite"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de finalización</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tipo de mantenimiento */}
                    <FormField
                        control={form.control}
                        name="tipoMantenimiento"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de mantenimiento</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tipo de mantenimiento" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Periodico">Periódico</SelectItem>
                                        <SelectItem value="Condicion">Por Condición</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Frecuencia (solo si es periódico) */}
                    {tipoMantenimiento === "Periodico" && (
                        <FormField
                            control={form.control}
                            name="frecuencia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Frecuencia</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar frecuencia" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Diaria">Diaria</SelectItem>
                                            <SelectItem value="Semanal">Semanal</SelectItem>
                                            <SelectItem value="Mensual">Mensual</SelectItem>
                                            <SelectItem value="Bimestral">Bimestral</SelectItem>
                                            <SelectItem value="Trimestral">Trimestral</SelectItem>
                                            <SelectItem value="Semestral">Semestral</SelectItem>
                                            <SelectItem value="Anual">Anual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                {/* Resumen */}
                <FormField
                    control={form.control}
                    name="resumen"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Resumen</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe las tareas específicas del mantenimiento..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 mt-4">
                    {onClose && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={createMantenimientoMutation.isPending}
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button
                        type="submit"
                        className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground"
                        disabled={createMantenimientoMutation.isPending}
                    >
                        {createMantenimientoMutation.isPending ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
