import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { useUbicacionesLista } from "@/hooks/ubicaciones-tecnicas/useUbicaciones";
import { useSupervisores } from "@/hooks/usuarios/useUsuarios";
import { useGrupos } from "@/hooks/grupos-trabajo/useGrupoTrabajo";
import { useCreateInspection } from "@/hooks/inspecciones/useCreateInspection";
import { inspeccionSchema, type InspeccionFormData } from "@/lib/validations/inspeccionSchema";

const AREA_OPTIONS = ["Electricidad", "Infraestructura", "Mecanica", "Refrigeracion", "Logistica"] as const;

interface InspectionFormModalProps {
    open: boolean;
    onClose: () => void;
    initialValues?: Partial<InspeccionFormData>;
    onSuccess?: () => void;
}

export const InspectionFormContent: React.FC<{
    initialValues?: Partial<InspeccionFormData>,
    onClose?: () => void,
    onSuccess?: () => void
}> = ({ initialValues, onClose, onSuccess }) => {
    const createInspectionMutation = useCreateInspection();
    const { data: ubicaciones, isLoading: isLoadingUbicaciones } = useUbicacionesLista();
    const { supervisores } = useSupervisores();
    const { data: grupos } = useGrupos();

    const form = useForm<InspeccionFormData>({
        resolver: zodResolver(inspeccionSchema),
        defaultValues: {
            estado: initialValues?.estado || 'programado',
            supervisor: initialValues?.supervisor || '',
            areaEncargada: initialValues?.areaEncargada || (initialValues as any)?.AreaEncargada || '',
            idUbicacionTecnica: initialValues?.idUbicacionTecnica || 0,
            frecuencia: initialValues?.frecuencia || '',
            cadaCuanto: initialValues?.cadaCuanto || 1,
            observacion: initialValues?.observacion || '',
            prioridad: initialValues?.prioridad || 'Media',
            fechaLimite: initialValues?.fechaLimite || '',
            idGrupo: initialValues?.idGrupo || 1,
        }
    });

    const frecuenciaSeleccionada = form.watch("frecuencia");

    const onSubmit = (data: InspeccionFormData) => {
   
        // Obtener la fecha actual local del computadora (sin zona horaria)
        const ahora = new Date();
        const año = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve 0-11
        const día = String(ahora.getDate()).padStart(2, '0');
        const fechaCreacion = `${año}-${mes}-${día}`;

        // Buscar el supervisor usando PascalCase (Nombre, Id)
        const supervisorEncontrado = supervisores?.find(s => s.Nombre === data.supervisor);
        const supervisorId = supervisorEncontrado?.Id || 0;

        // Mapear los datos del formulario al formato que espera el backend
        const inspeccionData = {
            tipoTrabajo: "Inspeccion" as const,
            fechaCreacion: fechaCreacion,
            idUbicacionTecnica: data.idUbicacionTecnica,
            idGrupo: data.idGrupo,
            supervisorId: supervisorId,
            areaEncargada: data.areaEncargada,
            prioridad: data.prioridad,
            fechaLimite: data.fechaLimite,
            frecuencia: data.frecuencia,
            especificacion: data.observacion
        };

    

        createInspectionMutation.mutate(inspeccionData, {
            onSuccess: () => {
                form.reset();
                onSuccess?.();
                onClose?.();
            }
        });
    };

    // Datos para los dropdowns
    const estados = [
        { value: 'programado', label: 'Programado' },
        { value: 'en_proceso', label: 'En Proceso' },
        { value: 'realizado', label: 'Realizado' },
        { value: 'cancelado', label: 'Cancelado' }
    ];

    const frecuencias = [
        { value: 'Diaria', label: 'Diaria' },
        { value: 'Semanal', label: 'Semanal' },
        { value: 'Mensual', label: 'Mensual' },
        { value: 'Anual', label: 'Anual' }
    ];

    const prioridades = [
        { value: 'Baja', label: 'Baja' },
        { value: 'Media', label: 'Media' },
        { value: 'Alta', label: 'Alta' }
    ];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Estado */}
                    <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {estados.map((estado) => (
                                            <SelectItem key={estado.value} value={estado.value}>
                                                {estado.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar prioridad" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {prioridades.map((prioridad) => (
                                            <SelectItem key={prioridad.value} value={prioridad.value}>
                                                {prioridad.label}
                                            </SelectItem>
                                        ))}
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar área encargada" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
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
                </div>

                {/* Ubicación Técnica */}
                <FormField
                    control={form.control}
                    name="idUbicacionTecnica"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
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
                                    triggerClassName="w-full"
                                    contentClassName="w-full"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    {/* Grupo de Trabajo */}
                    <FormField
                        control={form.control}
                        name="idGrupo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Grupo de Trabajo</FormLabel>
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    defaultValue={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar grupo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {grupos?.map((grupo: any) => (
                                            <SelectItem key={grupo.id} value={grupo.id.toString()}>
                                                {grupo.nombre} ({grupo.codigo})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Frecuencia */}
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
                                        {frecuencias.map((frecuencia) => (
                                            <SelectItem key={frecuencia.value} value={frecuencia.value}>
                                                {frecuencia.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Fecha Límite */}
                    <FormField
                        control={form.control}
                        name="fechaLimite"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha Límite</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Campo dinámico "Cada cuánto" */}
                {frecuenciaSeleccionada && (
                    <FormField
                        control={form.control}
                        name="cadaCuanto"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cada cuánto</FormLabel>
                                <div className="flex gap-2 items-center">
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            className="w-20"
                                            placeholder="1"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <span className="text-sm text-gray-500">
                                        {frecuenciaSeleccionada === 'Diaria' ? 'días' :
                                            frecuenciaSeleccionada === 'Semanal' ? 'semanas' :
                                                frecuenciaSeleccionada === 'Mensual' ? 'meses' :
                                                    frecuenciaSeleccionada === 'Anual' ? 'años' : 'unidades'}
                                    </span>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Resumen */}
                <FormField
                    control={form.control}
                    name="observacion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Resumen</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe las tareas específicas de la inspección..."
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
                            disabled={createInspectionMutation.isPending}
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button
                        type="submit"
                        className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground"
                        disabled={createInspectionMutation.isPending}
                    >
                        {createInspectionMutation.isPending ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export const InspectionFormModal: React.FC<InspectionFormModalProps> = ({ open, onClose, initialValues, onSuccess }) => {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Nueva Inspección</span>}
            className="bg-white max-w-4xl" // Wider modal
        >
            <InspectionFormContent onClose={onClose} initialValues={initialValues} onSuccess={onSuccess} />
        </Modal>
    );
};
