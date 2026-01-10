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
            areaEncargada: initialValues?.areaEncargada || "Electricidad",
            codigoArea: initialValues?.codigoArea || "",
            codigoVerificacion: initialValues?.codigoVerificacion || "",
            estado: initialValues?.estado || "Reprogramado",
            fechaCreacion: initialValues?.fechaCreacion || "2026-01-01",
            frecuencia: initialValues?.frecuencia || "Semanal",
            observacion: initialValues?.observacion || "Acceso bloqueado",
            supervisor: initialValues?.supervisor || "Carlos Ruiz",
            titulo: initialValues?.titulo || "Verificacion Patio",
        }
    });

    // Si vienen valores con idUbicacionTecnica, completar el código de verificación
    React.useEffect(() => {
        if (!form.getValues("codigoVerificacion") && initialValues?.idUbicacionTecnica && ubicaciones) {
            const u = ubicaciones.find((x: any) => x.idUbicacion === initialValues.idUbicacionTecnica);
            if (u?.codigo_Identificacion) {
                form.setValue("codigoVerificacion", u.codigo_Identificacion);
            }
        }
    }, [ubicaciones, initialValues?.idUbicacionTecnica]);

    const onSubmit = (data: InspeccionFormData) => {
        // Fecha local (YYYY-MM-DD)
        const ahora = new Date();
        const fechaCreacion = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;

        // SupervisorId desde nombre
        const supervisorEncontrado = supervisores?.find((s: any) => s.nombre === data.supervisor);
        const supervisorId = supervisorEncontrado?.id || 0;

        // idUbicacionTecnica desde código de verificación
        const idUbicacionTecnica =
            ubicaciones?.find((u: any) => u.codigo_Identificacion === data.codigoVerificacion)?.idUbicacion || 0;

        const inspeccionData = {
            tipoTrabajo: "Inspeccion" as const,
            fechaCreacion,
            idUbicacionTecnica,              // mapeado desde codigoVerificacion
            idGrupo: data.idGrupo,           // número ya en el form
            supervisorId,                    // mapeado desde nombre
            areaEncargada: data.areaEncargada,
            prioridad: data.prioridad,
            fechaLimite: data.fechaLimite,
            frecuencia: data.frecuencia,
            especificacion: data.observacion // texto libre
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
        { value: 'Programado', label: 'Programado' },
        { value: 'En_proceso', label: 'En Proceso' },
        { value: 'Realizado', label: 'Realizado' },
        { value: 'Cancelado', label: 'Cancelado' },
        { value: 'Reprogramado', label: 'Reprogramado' }
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
    console.log('Initial Values:', initialValues);
    console.log('Form Values:', form.getValues());

    const supervisorOptions = React.useMemo(
        () =>
            Array.from(
                new Map(
                    (supervisores ?? [])
                        .filter((s: any) => s && (s.id ?? s.Id) != null && (s.nombre ?? s.Nombre))
                        .map((s: any) => [
                            String(s.id ?? s.Id),
                            { id: String(s.id ?? s.Id), nombre: s.nombre ?? s.Nombre },
                        ])
                ).values()
            ),
        [supervisores]
    );

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
                                <Select onValueChange={field.onChange} value={field.value}>
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
                                <Select onValueChange={field.onChange} value={field.value}>
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

                {/* Ubicación Técnica (usa código en el form y mapea a id en el submit) */}
                <FormField
                    control={form.control}
                    name="codigoVerificacion"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Ubicación Técnica</FormLabel>
                            <FormControl>
                                <Combobox
                                    data={ubicaciones?.map((u: any) => ({
                                        value: u.codigo_Identificacion, // código como valor del form
                                        label: `${u.codigo_Identificacion} - ${u.descripcion}`
                                    })) || []}
                                    value={field.value || null}
                                    onValueChange={(value) => field.onChange(value || "")}
                                    placeholder={isLoadingUbicaciones ? "Cargando ubicaciones..." : "Seleccionar ubicación técnica"}
                                    searchPlaceholder="Buscar ubicación..."
                                    triggerClassName="w-full !border-2 !border-gray-200 !rounded-lg focus:!border-gray-200"
                                    contentClassName="w-full border border-gray-200 rounded-lg"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Supervisor (mapear a id en submit) */}
                    <FormField
                        control={form.control}
                        name="supervisor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Supervisor Asignado</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-44">
                                            <SelectValue placeholder="Seleccionar supervisor" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent 
                                        className='w-full'
                                    >
                                        {supervisorOptions.map((sup) => (
                                            <SelectItem key={`sup-${sup.id}`} value={sup.nombre}>
                                                {sup.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Grupo de Trabajo (número en el form) */}
                    <FormField
                        control={form.control}
                        name="codigoArea"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Grupo de Trabajo</FormLabel>
                                <Select
                                    onValueChange={(val) => field.onChange((val))}
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar grupo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {grupos?.map((grupo: any) => (
                                            <SelectItem key={grupo.codigo} value={grupo.codigo.toString()}>
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
                                <Select onValueChange={field.onChange} value={field.value}>
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

                {/* Cada cuánto */}
                {form.watch("frecuencia") && (
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
                                        {form.watch("frecuencia") === 'Diaria' ? 'días' :
                                         form.watch("frecuencia") === 'Semanal' ? 'semanas' :
                                         form.watch("frecuencia") === 'Mensual' ? 'meses' :
                                         form.watch("frecuencia") === 'Anual' ? 'años' : 'unidades'}
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
                        {createInspectionMutation.isPending ? "Guardando cambios..." : "Guardar cambios"}
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
