'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEditUsuario } from "@/hooks/usuarios/useEditUsuario";
import { useEffect } from "react";

const usuarioSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    correo: z.string().email("Correo inválido"),
    tipo: z.string().min(1, "El tipo es requerido"),
});

interface EditUsuarioFormProps {
    usuario: any;
    setUsuario: (usuario: any | null) => void;
}

export const EditUsuarioForm: React.FC<EditUsuarioFormProps> = ({
    usuario,
    setUsuario,
}) => {
    const form = useForm<z.infer<typeof usuarioSchema>>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: {
            nombre: "",
            correo: "",
            tipo: "",
        },
    });

    const editUsuarioMutation = useEditUsuario();

    useEffect(() => {
        if (usuario) {
            form.reset({
                nombre: usuario.nombre || usuario.Nombre,
                correo: usuario.correo || usuario.Correo,
                tipo: (usuario.tipo || usuario.Tipo || "").toUpperCase(),
            });
        }
    }, [usuario, form]);

    const handleSubmit = (values: z.infer<typeof usuarioSchema>) => {
        if (!usuario) return;
        editUsuarioMutation.mutate({
            id: usuario.id || usuario.Id,
            nombre: values.nombre,
            correo: values.correo,
            tipo: values.tipo,
        }, {
            onSuccess: () => {
                setUsuario(null);
            }
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) setUsuario(null);
    }

    return (
        <Dialog open={!!usuario} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
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
                                    <Select onValueChange={field.onChange} value={field.value}>
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
    );
};
