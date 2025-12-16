'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateUsuario } from "@/hooks/usuarios/useCreateUsuario";

const usuarioSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    correo: z.string().email("Correo inválido"),
    tipo: z.string().min(1, "El tipo es requerido"),
});

interface CreateUsuarioFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CreateUsuarioForm: React.FC<CreateUsuarioFormProps> = ({
    open,
    onOpenChange,
}) => {
    const form = useForm<z.infer<typeof usuarioSchema>>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: {
            nombre: "",
            correo: "",
            tipo: "",
        },
    });

    const createUsuarioMutation = useCreateUsuario();

    const handleSubmit = (values: z.infer<typeof usuarioSchema>) => {
        createUsuarioMutation.mutate({
            nombre: values.nombre,
            correo: values.correo,
            tipo: values.tipo,
        }, {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre y Apellido</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Juan Pérez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="correo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: juan.perez@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Usuario</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="TECNICO">Técnico</SelectItem>
                                            <SelectItem value="COORDINADOR">Coordinador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gema-green/80 hover:bg-gema-green"
                                disabled={createUsuarioMutation.isPending}
                            >
                                {createUsuarioMutation.isPending ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
