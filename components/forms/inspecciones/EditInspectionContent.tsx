import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EditInspectionRequest } from "@/hooks/inspecciones/useCreateInspection";
import { FRECUENCIA_OPTS, PRIORIDAD_OPTS } from "@/lib/validations/inspeccionSchema";
import { useUpdateMantenimiento } from '@/hooks/mantenimientos/useUpdateMantenimiento';
import { z } from "zod";
import { Inspeccion } from '@/types/inspecciones.types';
import { useUpdateInspection } from '@/hooks/inspecciones/useUpdateInspection';


const AREA_OPTIONS = ["Electricidad", "Infraestructura", "Mecanica", "Refrigeracion", "Logistica"] as const;



//Esquema de validación 
export const inspeccionSchema = z.object({
    frecuencia: z.enum(FRECUENCIA_OPTS),
    especificacion: z.string(),
    fechaCreacion: z.string().optional()
});

type InspeccionForm = z.infer<typeof inspeccionSchema>;


export const InspectionFormContent: React.FC<{
    initialData: Inspeccion,
    onClose?: () => void,
    onSuccess?: () => void
}> = ({ onClose, onSuccess, initialData }) => {

    //creamos el form 
    const form = useForm<InspeccionForm>({
        resolver: zodResolver(inspeccionSchema),
        defaultValues: {
            frecuencia: initialData.frecuencia,
            especificacion: initialData.observacion,
            fechaCreacion: initialData.fechaCreacion ? new Date(initialData.fechaCreacion).toISOString().split('T')[0] : undefined
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    console.log(initialData);
    //hook para crear la inspeccion 
    const mutation = useUpdateInspection(initialData.idInspeccion);


    //funcion para crear la inspeccion 
    const onSubmit = (data: InspeccionForm) => {

        const payload: EditInspectionRequest = {
            idMantenimiento: "0",
            idInspeccion: initialData.idInspeccion.toString(),
            frecuencia: data.frecuencia,
            observacion: data.especificacion,
            fechaCreacion: data.fechaCreacion,
            prioridad: initialData.prioridad
        };

        console.log(payload);

        mutation.mutate(payload, {
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
                    {/* Frecuencia */}
                    <FormField
                        control={form.control}
                        name="frecuencia"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Frecuencia</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className='w-full'>
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

                    {/* Fecha de Creacion */}
                    <FormField
                        control={form.control}
                        name="fechaCreacion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        className="w-full"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="px-4">
                    {/* Especificación */}
                    <FormField
                        control={form.control}
                        name="especificacion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Observación</FormLabel>
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
                </div>



                <div className="flex justify-end gap-2 mt-4">
                    {onClose && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={mutation.isPending}
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button
                        type="submit"
                        className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}; 