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
import {  FRECUENCIA_OPTS, PRIORIDAD_OPTS } from "@/lib/validations/inspeccionSchema";
import { CreateInspectionRequest } from '@/hooks/inspecciones/useCreateInspection';
import { toast } from 'sonner';
import { z } from "zod";


const AREA_OPTIONS = ["Electricidad", "Infraestructura", "Mecanica", "Refrigeracion", "Logistica"] as const;

interface InspectionFormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

//Esquema de validación 
export const inspeccionSchema = z.object({
  // tipo de trabajo 
  tipoTrabajo: z.string("Inspeccion"),

  fechaCreacion: z.string(),
  // Campos visibles en tu form/defaults
  prioridad: z.enum(PRIORIDAD_OPTS),

  // Ubicación técnica y grupo
  idUbicacionTecnica: z.number().min(1, "Selecciona una ubicación técnica"),
  idGrupo: z.number().min(1, "Selecciona un grupo de trabajo"),

  // Frecuencia
  frecuencia: z.enum(FRECUENCIA_OPTS),

  // Texto libre
  especificacion: z.string().min(1, "La especificación es requerida"),
});

type InspeccionForm = z.infer<typeof inspeccionSchema>;

export const InspectionFormContent: React.FC<{
    onClose?: () => void,
    onSuccess?: () => void
}> = ({ onClose, onSuccess }) => {

    //creamos el form 
    const form = useForm<InspeccionForm>({
        resolver: zodResolver(inspeccionSchema),
        defaultValues: {
            tipoTrabajo: "Inspeccion",
            fechaCreacion: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
            idUbicacionTecnica: 0,
            idGrupo: 0,
            prioridad: "Media",
            frecuencia: "Semanal",
            especificacion: "",
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });


    const { data: ubicaciones, isLoading: isLoadingUbicaciones } = useUbicacionesLista();

    const { data: grupos } = useGrupos();



    //hook para crear la inspeccion 
    const createInspectionMutation = useCreateInspection();


    //funcion para crear la inspeccion 
    const onSubmit = (data: InspeccionForm) => {

        const payload: CreateInspectionRequest = {
            tipoTrabajo: data.tipoTrabajo,
            fechaCreacion: data.fechaCreacion,
            idUbicacionTecnica: Number(data.idUbicacionTecnica),
            idGrupo: Number(data.idGrupo),
            prioridad: data.prioridad,
            frecuencia: data.frecuencia,
            especificacion: data.especificacion,
        };

        console.log(payload); 

        createInspectionMutation.mutate(payload, {
            onSuccess: () => {
                form.reset(); 
                onSuccess?.();
                onClose?.();
            },
            onError: (error) => {
                console.error(error);  
            }
        });

    }
    


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                    
                    <div className="p-4 flex flex-col gap-4">
                        {/* Ubicación Técnica (usa código en el form y mapea a id en el submit) */}
                        
                        <FormField
                            control={form.control}
                            name="idUbicacionTecnica"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Ubicación Técnica</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            data={ubicaciones?.map((u) => ({
                                                value: u.idUbicacion, // ID numérico como valor
                                                label: `${u.codigo_Identificacion} - ${u.descripcion}`
                                            })) || []}
                                            value={field.value || null}
                                            onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
                                            placeholder={isLoadingUbicaciones ? "Cargando ubicaciones..." : "Seleccionar ubicación técnica"}
                                            searchPlaceholder="Buscar ubicación..."
                                            triggerClassName="w-full !border-gray-200 "
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Supervisor (mapear a id en submit) */}
                       
                        


                        

                        {/* Grupo de Trabajo (número en el form) */}
                        <FormField
                            control={form.control}
                            name="idGrupo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Grupo de Trabajo</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Seleccionar grupo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {grupos?.map((grupo) => (
                                                <SelectItem key={grupo.id} value={grupo.id.toString()}>
                                                    {grupo.nombre} ({grupo.codigo})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                    </div>

                    <div className="p-4 flex flex-col gap-4">

                        {/* Frecuencia */}
                        <FormField
                            control={form.control}
                            name="frecuencia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Frecuencia</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className='w-1/2'>
                                                <SelectValue placeholder="Seleccionar frecuencia" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {FRECUENCIA_OPTS.map((frecuencia) => (
                                                <SelectItem key={frecuencia} value={frecuencia}>
                                                    {frecuencia}
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
                                            <SelectTrigger className='w-1/2'>
                                                <SelectValue placeholder="Seleccionar prioridad" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {PRIORIDAD_OPTS.map((prioridad) => (
                                                <SelectItem key={prioridad} value={prioridad}>
                                                    {prioridad}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        
                    </div>
                </div>

                <div className="px-4">
                    {/* Especificación */}
                    <FormField
                        control={form.control}
                        name="especificacion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Especificación</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe las tareas específicas de la inspección..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                

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

export const InspectionFormModal: React.FC<InspectionFormModalProps> = ({ open, onClose, onSuccess }) => {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Nueva Inspección</span>}
            className="bg-white max-w-4xl" // Wider modal
        >
            <InspectionFormContent onClose={onClose} onSuccess={onSuccess} />
        </Modal>
    );
};
