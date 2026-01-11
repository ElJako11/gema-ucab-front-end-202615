'use client'

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEditTecnico } from "@/hooks/tecnicos/useEditTecnico";
import { useGrupos } from "@/hooks/grupos-trabajo/useGrupoTrabajo";
import { useEffect } from "react";
import { Tecnico } from "@/types/tecnicos.types";

// Esquema de validación
const tecnicoSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    correo: z
        .string()
        .regex(
            /^[a-zA-Z0-9._%+-]+@ucab\.edu\.ve$/,
            "Debe ser un correo institucional @ucab.edu.ve"
        ),
    idGrupo: z.number().min(1, "Debes seleccionar un grupo"),
});

type TecnicoForm = z.infer<typeof tecnicoSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    tecnico: Tecnico | null;
}

export const EditarTecnicoForm: React.FC<Props> = ({ open, onClose, tecnico }) => {

    // Configuración del formulario
    const form = useForm<TecnicoForm>({
        resolver: zodResolver(tecnicoSchema),
        defaultValues: {
            nombre: "",
            correo: "",
            idGrupo: 0,
        },
    });

    // Hooks
    const mutation = useEditTecnico();
    const { data: grupos } = useGrupos();

    // Efecto para cargar los datos del técnico cuando se abre el modal
    useEffect(() => {
        if (tecnico && open) {
            form.reset({
                nombre: tecnico.nombre || "",
                correo: tecnico.correo || "",
                idGrupo: tecnico.idGT || tecnico.idGrupo || 0, // Usar idGT o idGrupo
            });
        }
    }, [tecnico, open, form]);

    // Función para manejar el envío
    const onSubmit = (values: TecnicoForm) => {
        if (!tecnico) return;

        // Mapeamos los datos del formulario a la estructura que espera la API
        const payload: Tecnico = {
            idTecnico: tecnico.idTecnico,
            nombre: values.nombre,
            correo: values.correo,
            idGT: values.idGrupo
        };

        mutation.mutate(payload, {
            onSuccess: () => {
                form.reset();
                onClose();
            },
            onError: (error) => {
                console.error("Error al editar tecnico: ", error);
            }
        });
    };

    const handleSubmit = form.handleSubmit(onSubmit);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md w-full" contentClassName="pt-6">
                <DialogHeader className="pb-2">
                    <DialogTitle>Editar Técnico</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="nombre"
                                            placeholder="Ejemplo: Juan Pérez"
                                            autoComplete="off"
                                            {...field}
                                        />
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
                                    <FormLabel>Correo institucional</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="correo"
                                            placeholder="ejemplo@ucab.edu.ve"
                                            autoComplete="off"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="idGrupo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Grupo de Trabajo</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value?.toString()} // Controlamos el valor con el estado del form
                                        disabled={mutation.isPending}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar grupo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {grupos?.map((grupo: any) => (
                                                <SelectItem key={grupo.id} value={grupo.id.toString()}>
                                                    {grupo.nombre} ({grupo.codigo})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={onClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground"
                                type="submit"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Guardando cambios..." : "Guardar cambios"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};