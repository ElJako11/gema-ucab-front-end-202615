import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { mantenimientoSchema, type MantenimientoFormData } from "@/lib/validations/mantenimientoSchema";
import { useCreateMantenimiento } from "@/hooks/mantenimientos/useCreateMantenimientos";
import { useUbicaciones } from "@/hooks/ubicaciones-tecnicas/useUbicaciones";
import { ComboSelectInput } from "@/components/ui/comboSelectInput";
import { useSupervisores } from "@/hooks/usuarios/useUsuarios";

interface MaintenanceFormContentProps {
    initialValues?: Partial<MantenimientoFormData>;
    onClose?: () => void;
    onSuccess?: () => void;
}

export const MaintenanceFormContent: React.FC<MaintenanceFormContentProps> = ({
    initialValues,
    onClose,
    onSuccess
}) => {
    const createMantenimientoMutation = useCreateMantenimiento();
    const { data: ubicaciones } = useUbicaciones();
    const { supervisores, isLoading: isLoadingSupervisores } = useSupervisores();

    const form = useForm<MantenimientoFormData>({
        resolver: zodResolver(mantenimientoSchema),
        defaultValues: {
            nombre: initialValues?.nombre || '',
            prioridad: initialValues?.prioridad || 'Media',
            estado: initialValues?.estado || 'no_empezado',
            supervisor: initialValues?.supervisor || '',
            fechaInicio: initialValues?.fechaInicio || '',
            fechaFin: initialValues?.fechaFin || '',
            tipoMantenimiento: initialValues?.tipoMantenimiento || 'Periodico',
            repeticion: initialValues?.repeticion || 'unico',
            frecuencia: initialValues?.frecuencia,
            idUbicacionTecnica: initialValues?.idUbicacionTecnica || 0, // 0 as empty/initial
            idGrupo: initialValues?.idGrupo || 1,
            especificacion: initialValues?.especificacion || ''
        }
    });

    const tipoMantenimiento = form.watch("tipoMantenimiento");

    // eliminar array de encargados hardcoded

    const onSubmit = (data: MantenimientoFormData) => {
        // Mapear los datos del formulario al formato que espera el backend
        const mantenimientoData = {
            tipoTrabajo: "Mantenimiento" as const,
            fechaCreacion: new Date().toISOString(),
            idUbicacionTecnica: data.idUbicacionTecnica,
            idGrupo: data.idGrupo,
            prioridad: data.prioridad,
            fechaLimite: data.fechaFin,
            frecuencia: data.frecuencia || "Mensual",
            tipoMantenimiento: data.tipoMantenimiento,
            repeticion: data.tipoMantenimiento === 'Periodico' ? 'periodico' : 'unico',
            estado: 'no_empezado' as const, // Default
            especificacion: data.especificacion
        };

        createMantenimientoMutation.mutate(mantenimientoData, {
            onSuccess: () => {
                form.reset();
                onSuccess?.();
                onClose?.();
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
                {/* Nombre del mantenimiento */}
                <div className="col-span-2">
                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del mantenimiento</FormLabel>
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
                        name="idUbicacionTecnica"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Ubicación Técnica</FormLabel>
                                <FormControl>
                                    <ComboSelectInput
                                        value={field.value?.toString() || ""}
                                        onChange={(val) => field.onChange(Number(val))}
                                        options={ubicaciones?.map(u => ({
                                            value: u.idUbicacion.toString(),
                                            label: `${u.codigo_Identificacion} - ${u.descripcion}`
                                        })) || []}
                                        placeholder="Buscar ubicación..."
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        name="fechaInicio"
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
                        name="fechaFin"
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

                {/* Especificación */}
                <FormField
                    control={form.control}
                    name="especificacion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Especificación</FormLabel>
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
