import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogHeader, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateChecklistItem } from "@/hooks/checklist/useUpdateChecklistItem";
import { Actividad } from "@/types/checklist.types";

interface ChecklistProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    actividad: Actividad | null;
    checklistId: number;
}

//Esquema de validacion
const actividadSchema = z.object({
    nombre: z
        .string()
        .min(5, "El nombre de la actividad debe ser más descriptivo (mínimo 5 letras)")
        .max(100, "El nombre es demasiado largo"),
    
    descripcion: z
        .string()
        .max(500, "La descripción no puede exceder los 500 caracteres")
});

export const EditarChecklistItemForm: React.FC<ChecklistProps> = ({
    open,
    onClose,
    onSuccess,
    actividad,
    checklistId
}) => {
    const queryClient = useQueryClient();
    const updateMutation = useUpdateChecklistItem();

    type FormValues = z.infer<typeof actividadSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(actividadSchema),
        defaultValues: {
            nombre: "",
            descripcion: ""
        },
        mode: "onChange", // Validación en cada cambio    
    });

    useEffect(() => {
        if (actividad) {
            // Esto actualiza los campos cuando llega la actividad
            form.reset({
                nombre: actividad.nombre || "",
                descripcion: actividad.descripcion || ""
            });
        }
    }, [actividad, form]); //se ejecuta cuando cambia la actividad

    const handleSubmit = form.handleSubmit((values) => {
        if (!actividad) return;

        // 3. ACTUALIZA LA LLAMADA AL MUTATE
        updateMutation.mutate({
            checklistId: checklistId, // Ahora pasamos el ID del padre
            data: {
                id: actividad.id,
                nombre: values.nombre,
                descripcion: values.descripcion,
                estado: actividad.estado
            }
        }, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
                handleClose();
            }
        });
    });

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md w-full space-y-2">
                <DialogHeader>
                <DialogTitle>Nueva Actividad</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nombre de la Actividad</FormLabel>
                        <FormControl>
                            <Input
                            autoComplete="name"
                            {...field}
                            disabled={updateMutation.isPending}
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
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                            <Input
                            autoComplete="name"
                            {...field}
                            disabled={updateMutation.isPending}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={updateMutation.isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground"
                        disabled={updateMutation.isPending || !form.formState.isValid}
                    >
                        {updateMutation.isPending ? "Actualizando..." : "Guardar"}
                    </Button>
                    </div>
                </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}