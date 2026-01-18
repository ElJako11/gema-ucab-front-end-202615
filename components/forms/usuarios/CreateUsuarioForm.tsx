'use client';

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateUsuario } from "@/hooks/usuarios/useCreateUsuario";
import { useUsuarios } from "@/hooks/usuarios/useUsuarios";

const usuarioSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    correo: z.string().email("Correo inválido").refine((val) => val.includes("ucab.edu.ve") && val.includes("@"), {
        message: "El correo debe ser del dominio @ucab.edu.ve"
    }),
    contraseña: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
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
            contraseña: "",
        },
    });

    const { errors } = form.formState;

    // Resetear el formulario cuando se cierra el modal
    useEffect(() => {
        if (!open) {
            form.reset();
        }
    }, [open, form]);

    const createUsuarioMutation = useCreateUsuario();
    const { usuarios } = useUsuarios();

    const handleSubmit = (values: z.infer<typeof usuarioSchema>) => {
        // Validar si el correo ya existe en la lista de usuarios cargada (verificación frontend)
        if (usuarios && usuarios.some(u => u.correo.toLowerCase() === values.correo.trim().toLowerCase())) {
            form.setError("correo", { type: "manual", message: "Este correo ya está asignado a un usuario" });
            form.setFocus("correo");
            return;
        }

        createUsuarioMutation.mutate({
            nombre: values.nombre,
            correo: values.correo,
            tipo: values.tipo as "SUPERVISOR" | "COORDINADOR" | "DIRECTOR",
            contraseña: values.contraseña,
        }, {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
            onError: (error) => {
                const message = error instanceof Error ? error.message : "Error al crear usuario";
                const lower = message.toLowerCase();
                
                // Catch duplicates (often 500 or specific message)
                if (lower.includes("correo") || lower.includes("email") || lower.includes("error interno") || lower.includes("server error")) {
                    form.setError("correo", { type: "manual", message: "Este correo ya está asignado a un usuario" });
                    form.setFocus("correo");
                }
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
                                        <Input
                                            placeholder="Ej: juan.perez@ucab.edu.ve"
                                            className={errors.correo ? "border-red-500 focus-visible:ring-red-500" : undefined}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contraseña"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="password123"
                                            {...field}
                                        />
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
                                    <FormLabel>Rol</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un rol" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
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
