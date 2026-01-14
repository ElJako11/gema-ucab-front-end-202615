import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { mantenimientoEditSchema } from "@/lib/validations/mantenimientoSchema";
import { EditMantenimientoRequest } from "@/lib/api/mantenimientos";
import { useUpdateMantenimiento } from "@/hooks/mantenimientos/useUpdateMantenimiento";
import type { Mantenimiento } from "@/types/mantenimientos.types";



type MantenimientoEditFormData = z.infer<typeof mantenimientoEditSchema>;

interface MaintenanceFormContentProps {
    initialValues: Mantenimiento;
    onClose?: () => void;
    onSuccess?: () => void;
    mantenimientoId: number;
}

export const EditarMantenimientoFormContent: React.FC<MaintenanceFormContentProps> = ({
    initialValues,
    onClose,
    onSuccess,
    mantenimientoId,
}) => {

    console.log(initialValues);


    const mutation = useUpdateMantenimiento(mantenimientoId);

    const form = useForm<MantenimientoEditFormData>({
        resolver: zodResolver(mantenimientoEditSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            titulo: initialValues.titulo,
            prioridad: initialValues.prioridad,
            fechaLimite: initialValues.fechaLimite,
            tipo: initialValues.tipo,
            frecuencia: initialValues.frecuencia,
            resumen: initialValues.resumen,
        }
    });

    const tipoMantenimiento = initialValues.tipo;

    // Función para determinar si es periódico (maneja ambos casos: con y sin tilde)
    const esPeriodico = (tipo: string) => {
        return tipo.toLowerCase() === "periodico";
    };

    // Función para normalizar el valor del tipo de mantenimiento
    const getTipoValue = (tipo?: string) => {
        if (!tipo) return "Por Condición";
        return esPeriodico(tipo) ? "Periodico" : "Por Condición";
    };

    // Función para normalizar frecuencia (asegura que coincida con los SelectItem)
    const getFrecuenciaValue = (frecuencia?: string) => {
        if (!frecuencia) return undefined;
        // Capitaliza la primera letra y pone el resto en minúscula
        const normalized = frecuencia.charAt(0).toUpperCase() + frecuencia.slice(1).toLowerCase();
        const validOptions = ["Diaria", "Semanal", "Mensual", "Trimestral", "Anual"];
        return validOptions.includes(normalized) ? normalized : undefined;
    };

    const onSubmit = (data: MantenimientoEditFormData) => {


        const payload: EditMantenimientoRequest = {
            id: mantenimientoId,
            titulo: data.titulo,
            prioridad: data.prioridad?.toUpperCase(),
            fechaLimite: data.fechaLimite,
            tipo: data.tipo === "Periodico" ? "Periodico" : "Condicion",
            frecuencia: data.frecuencia,
            resumen: data.resumen ? data.resumen : "Ninguno."
        }

        console.log("payload", payload);

        mutation.mutate(payload, {
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="p-4 grid grid-cols-2 gap-6 my-2">

                    <div className="flex flex-col gap-6">
                        {/* Tipo de mantenimiento */}
                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de mantenimiento</FormLabel>
                                    <Select onValueChange={field.onChange} value={getTipoValue(field.value)}>
                                        <FormControl>
                                            <SelectTrigger className="w-3/4">
                                                <SelectValue placeholder="Tipo de mantenimiento" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent >
                                            <SelectItem value="Periodico">Periodico</SelectItem>
                                            <SelectItem value="Condicion">Por Condición</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Frecuencia (solo si es periódico) */}
                        {esPeriodico(tipoMantenimiento) && (
                            <FormField
                                control={form.control}
                                name="frecuencia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Frecuencia</FormLabel>
                                        <Select onValueChange={field.onChange} value={getFrecuenciaValue(field.value)}>
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
                                        <FormMessage />
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
                                    <FormLabel>Fecha de Limite</FormLabel>
                                    <FormControl className="w-full border-gray-200">
                                        <Input type="date" {...field} />
                                    </FormControl>
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
                                    value={field.value ?? ""}
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
