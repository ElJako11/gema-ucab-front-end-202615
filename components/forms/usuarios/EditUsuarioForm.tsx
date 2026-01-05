'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUpdateUsuario } from "@/hooks/usuarios/useUpdateUsuario";
import { FormEvent, useEffect, useState } from "react";
import { Usuario } from "@/types/usuarios.types";

const usuarioSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    correo: z.string().email("Correo inválido").refine((val) => val.includes("@ucab.edu.ve"), {
        message: "El correo debe ser del dominio @ucab.edu.ve"
    }),
    tipo: z.string().min(1, "El tipo es requerido"),
    contraseña: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 8, {
            message: "La contraseña debe tener al menos 8 caracteres",
        }),
});

interface EditUsuarioFormProps {
    usuario: Usuario;
    setUsuario: (usuario: Usuario | null) => void;
}

export const EditUsuarioForm: React.FC<EditUsuarioFormProps> = ({
    usuario,
    setUsuario,
}) => {

    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingValues, setPendingValues] = useState<z.infer<typeof usuarioSchema> | null>(null);


    const form = useForm<z.infer<typeof usuarioSchema>>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: {
            nombre: "",
            correo: "",
            tipo: "",
            contraseña: "",
        },
    });

    const editUsuarioMutation = useUpdateUsuario();

    useEffect(() => {
        if (usuario) {
            form.reset({
                nombre: usuario.nombre,
                correo: usuario.correo,
                tipo: usuario.tipo,
                contraseña: "",
            });
        }
    }, [usuario, form]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isValid = await form.trigger();
        if (!isValid) return;

        const values = form.getValues();
        const hasChanges = usuario
            ? values.nombre !== usuario.nombre
                || values.correo !== usuario.correo
                || values.tipo !== usuario.tipo
                || (!!values.contraseña && values.contraseña.trim().length > 0)
            : false;

        if (!hasChanges) {
            form.setError("nombre", { type: "manual", message: "Realiza algún cambio antes de guardar." }, { shouldFocus: true });
            return;
        }

        setPendingValues(values);
        setShowConfirm(true);
    };

    const handleConfirmEdit = () => {
        if (!usuario || !pendingValues) return;
        editUsuarioMutation.mutate({
            id: usuario.id,
            user: {
                nombre: pendingValues.nombre,
                correo: pendingValues.correo,
                tipo: pendingValues.tipo as "SUPERVISOR" | "COORDINADOR" | "DIRECTOR",
                contraseña: pendingValues.contraseña || usuario.contraseña || "defaultPassword123"
            }
        }, {
            onSuccess: () => {
                setShowConfirm(false);
                setUsuario(null);
            },
            onError: (error) => {
                const message = error instanceof Error ? error.message : "Error al actualizar usuario";
                if (message.toLowerCase().includes("correo") && message.toLowerCase().includes("uso")) {
                    form.setError("correo", { type: "manual", message: "El correo electrónico ya está en uso" });
                }
                setShowConfirm(false);
            }
        });
    };

    console.log("Current usuario:", usuario);

    const handleOpenChange = (open: boolean) => {
        if (!open) setUsuario(null);
    }

    return (
        <div>
        <Dialog open={!!usuario} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                        <Input placeholder="Ej: juan.perez@ucab.edu.ve" {...field} />
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
                                            <SelectItem value="DIRECTOR">Director</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contraseña"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Nueva contraseña" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setUsuario(null)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gema-green/80 hover:bg-gema-green"
                                disabled={editUsuarioMutation.isPending}
                            >
                                {editUsuarioMutation.isPending ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Deseas editar este ítem?</DialogTitle>
                </DialogHeader>
                <div className="py-2 text-sm text-gray-600">
                    Se actualizarán los datos del usuario seleccionado.
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowConfirm(false)}
                        disabled={editUsuarioMutation.isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmEdit}
                        className="bg-gema-green/80 hover:bg-gema-green"
                        disabled={editUsuarioMutation.isPending}
                    >
                        {editUsuarioMutation.isPending ? "Guardando..." : "Confirmar"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
        </div>
    );
}
