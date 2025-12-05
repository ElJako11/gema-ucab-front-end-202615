'use client'

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";

// Esquema de validación
const actividadSchema = z.object({
    nombre: z.string().min(2, "El nombre de la actividad es requerido"),
    descripcion: z.string().optional(),
});

type ActividadForm = z.infer<typeof actividadSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    onSave?: (data: ActividadForm) => void;
    initialData?: { nombre: string; descripcion: string } | null;
}

const FormNuevaActividad: React.FC<Props> = ({ open, onClose, onSave, initialData }) => {
    const form = useForm<ActividadForm>({
        resolver: zodResolver(actividadSchema),
        defaultValues: {
            nombre: "",
            descripcion: "",
        },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    nombre: initialData.nombre,
                    descripcion: initialData.descripcion || "",
                });
            } else {
                form.reset({
                    nombre: "",
                    descripcion: "",
                });
            }
        }
    }, [open, initialData, form]);

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const onSubmit = (data: ActividadForm) => {
        console.log("Guardando actividad:", data);
        if (onSave) {
            onSave(data);
        }
        toast.success(initialData ? "Actividad actualizada exitosamente" : "Actividad creada exitosamente");
        form.reset();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Editar Actividad" : "Nueva Actividad"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Nombre de la actividad</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-gray-500"
                                            placeholder="Ej: Revisar nivel de aceite"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="descripcion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Descripción de la actividad</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="border-gray-500"
                                            placeholder="Describe en qué consiste esta actividad..."
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gema-green hover:bg-green-700"
                            >
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default FormNuevaActividad;
