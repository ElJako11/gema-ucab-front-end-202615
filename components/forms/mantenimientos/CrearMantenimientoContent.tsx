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
import { useGrupos } from "@/hooks/grupos-trabajo/useGrupoTrabajo";
import { CreateMantenimientoRequest } from "@/lib/api/mantenimientos";


type MantenimientoFormData = z.infer<typeof mantenimientoSchema>;

interface MaintenanceFormContentProps {
    initialValues?: Partial<MantenimientoFormData>;
    onClose?: () => void;
    onSuccess?: () => void;
    maintenanceName?: string;
}

export const MaintenanceFormContent: React.FC<MaintenanceFormContentProps> = ({
    initialValues,
    onClose,
    onSuccess
}) => {


    const createMantenimientoMutation = useCreateMantenimiento();
    const { data: ubicaciones, isLoading: isLoadingUbicaciones } = useUbicacionesLista();
    const { data: grupos } = useGrupos();

    const form = useForm<MantenimientoFormData>({
        resolver: zodResolver(mantenimientoSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            tipoTrabajo: "Mantenimiento",
            titulo: initialValues?.titulo || '',
            prioridad: initialValues?.prioridad || 'MEDIA',
            idUbicacionTecnica: initialValues?.idUbicacionTecnica || 0,
            idGrupo: initialValues?.idGrupo || 0,
            fechaCreacion: initialValues?.fechaCreacion || new Date().toISOString().split('T')[0],
            fechaLimite: initialValues?.fechaLimite || '',
            tipo: initialValues?.tipo || 'Periodico',
            frecuencia: initialValues?.frecuencia,
            resumen: initialValues?.resumen || ''
        }
    });

    const tipoMantenimiento = form.watch("tipo");

    // eliminar array de encargados hardcoded

    const onSubmit = (data: MantenimientoFormData) => {
        console.log("Form submitted with data:", data);

        // Validar que la fecha límite sea posterior a la fecha de inicio
        if (data.fechaCreacion && data.fechaLimite) {
            const inicio = new Date(data.fechaCreacion);
            const fin = new Date(data.fechaLimite);
            if (fin <= inicio) {
                form.setError("fechaLimite", {
                    type: "manual",
                    message: "La fecha de finalización debe ser posterior a la fecha de inicio",
                });
                return;
            }
        }

        const payload: CreateMantenimientoRequest = {
            tipoTrabajo: "Mantenimiento",
            nombre: data.titulo,
            prioridad: data.prioridad,
            fechaCreacion: data.fechaCreacion || new Date().toISOString().split('T')[0],
            fechaLimite: data.fechaLimite, // +7 días si no se especifica
            tipo: data.tipo,
            frecuencia: data.frecuencia ?? "Semanal",
            idUbicacionTecnica: data.idUbicacionTecnica,
            idGrupo: data.idGrupo,
            resumen: data.resumen ?? " "
        }

        console.log("Payload to send:", payload);
        createMantenimientoMutation.mutate(payload, {
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
        console.log("Form validation errors:", errors);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                {/* Nombre del mantenimiento */}

                <div className="p-4">
                    <FormField
                        control={form.control}
                        name="titulo"
                        render={({ field }) => (
                            <FormItem className="w-3/4 border-gray-200">
                                <FormLabel>Nombre</FormLabel>
                                <FormControl className=" border-gray-200">
                                    <Input placeholder="Ej: Mantenimiento preventivo de aires acondicionados" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="p-4 grid grid-cols-2 gap-6 my-2">

                    <div className="flex flex-col gap-6">

                        {/* Fecha de inicio */}
                        <FormField
                            control={form.control}
                            name="fechaCreacion"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Fecha de inicio</FormLabel>
                                    <FormControl className="w-full border-gray-200">
                                        <Input type="date" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />


                        {/* Ubicación Técnica */}
                        <FormField
                            control={form.control}
                            name="idUbicacionTecnica"
                            render={({ field }) => (
                                <FormItem className="flex flex-col ">
                                    <FormLabel>Ubicación Técnica</FormLabel>
                                    <FormControl>
                                        <Combobox

                                            data={ubicaciones?.map(u => ({
                                                value: u.idUbicacion,
                                                label: `${u.codigo_Identificacion} - ${u.descripcion}`
                                            })) || []}
                                            value={field.value || null}
                                            onValueChange={(value) => field.onChange(value || 0)}
                                            placeholder={isLoadingUbicaciones ? "Cargando ubicaciones..." : "Seleccionar ubicación técnica"}
                                            searchPlaceholder="Buscar ubicación..."
                                            triggerClassName="w-full !border-gray-200 overflow-hidden text-ellipsis"
                                            contentClassName="w-full border-gray-200 overflow-hidden"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Grupo de Trabajo */}
                        <FormField
                            control={form.control}
                            name="idGrupo"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Grupo de Trabajo</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            data={grupos?.map((grupo) => ({
                                                value: grupo.id,
                                                label: `${grupo.nombre} (${grupo.codigo})`,
                                            })) || []}
                                            value={field.value || null}
                                            onValueChange={(value) => field.onChange(value || 0)}
                                            placeholder="Seleccionar grupo"
                                            searchPlaceholder="Buscar grupo..."
                                            triggerClassName="w-full  !border-gray-200"
                                            contentClassName="w-full"
                                        />
                                    </FormControl>
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
                                                <SelectItem value="Trimestral">Trimestral</SelectItem>
                                                <SelectItem value="Anual">Anual</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Fecha de finalización */}
                        <FormField
                            control={form.control}
                            name="fechaLimite"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de finalización</FormLabel>
                                    <FormControl className="w-full border-gray-200">
                                        <Input type="date" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />


                        {/* Prioridad */}
                        <FormField
                            control={form.control}
                            name="prioridad"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prioridad</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-1/2">
                                                <SelectValue placeholder="Seleccionar prioridad" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="BAJA">Baja</SelectItem>
                                            <SelectItem value="MEDIA">Media</SelectItem>
                                            <SelectItem value="ALTA">Alta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Tipo de mantenimiento */}
                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de mantenimiento</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-3/4">
                                                <SelectValue placeholder="Tipo de mantenimiento" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent >
                                            <SelectItem value="Periodico">Periódico</SelectItem>
                                            <SelectItem value="Condicion">Por Condición</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>


                {/* Resumen */}
                <FormField
                    control={form.control}
                    name="resumen"
                    render={({ field }) => (
                        <FormItem className="p-4">
                            <FormLabel>Resumen</FormLabel>
                            <FormControl >
                                <Textarea
                                    placeholder="Describa el mantenimiento..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
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
