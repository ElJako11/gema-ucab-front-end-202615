import { useQueryClient } from "@tanstack/react-query";
import { useCreateChecklistItem } from "@/hooks/checklist/useCreateChecklistItem";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogHeader, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ChecklistProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
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

export const AgregarChecklistItemForm: React.FC<ChecklistProps> = ({
    open,
    onClose,
    onSuccess,
    checklistId
}) => {
    const queryClient = useQueryClient();
    const createMutation = useCreateChecklistItem();

    type FormValues = z.infer<typeof actividadSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(actividadSchema),
        defaultValues: {
            nombre: "",
            descripcion: ""},
        mode: "onChange", // Validación en cada cambio    
    });

    const handleSubmit = form.handleSubmit((values) => {
        createMutation.mutate({
            checklistId: checklistId, // <--- 2. Pasamos el ID al hook
            data: {
                id: 0, // No importa, es nuevo
                nombre: values.nombre,
                descripcion: values.descripcion || "",
                estado: "PENDIENTE"
            }
        }, {
            onSuccess: () => {
                form.reset();
                onClose();
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
                            placeholder="Ej: Revisar filtros de aires acondicionados"
                            autoComplete="name"
                            {...field}
                            disabled={createMutation.isPending}
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
                            placeholder="Ej: Verificar que los filtros estén limpios y en buen estado"
                            autoComplete="name"
                            {...field}
                            disabled={createMutation.isPending}
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
                        disabled={createMutation.isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground"
                        disabled={createMutation.isPending || !form.formState.isValid}
                    >
                        {createMutation.isPending ? "Creando..." : "Guardar"}
                    </Button>
                    </div>
                </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}