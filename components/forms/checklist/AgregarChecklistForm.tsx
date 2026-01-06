import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../form";

// Define the schema
const checklistSchema = z.object({
    opcion: z.enum(["Nuevo", "Plantilla"]),
    nombre: z.string().optional(),
    plantilla: z.string().optional(),
}).refine((data) => {
    if (data.opcion === "Plantilla" && !data.plantilla) {
        return false;
    }
    return true;
}, {
    message: "Debe seleccionar una plantilla",
    path: ["plantilla"],
}).refine((data) => {
    if (data.opcion === "Nuevo" && (!data.nombre || data.nombre.length < 1)) {
        return false;
    }
    return true;
}, {
    message: "El nombre del checklist es requerido",
    path: ["nombre"],
});

type ChecklistFormValues = z.infer<typeof checklistSchema>;

interface AgregarChecklistFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (data: ChecklistFormValues) => void;
}

export const AgregarChecklistForm: React.FC<AgregarChecklistFormProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const form = useForm<ChecklistFormValues>({
        resolver: zodResolver(checklistSchema),
        defaultValues: {
            opcion: "Nuevo",
            nombre: "",
            plantilla: "",
        },
    });

    const { watch, reset, setValue } = form;
    const opcion = watch("opcion");

    // Reset form when modal opens/closes
    useEffect(() => {
        if (open) {
            reset({
                opcion: "Nuevo",
                nombre: "",
                plantilla: "",
            });
        }
    }, [open, reset]);

    const onSubmit = (data: ChecklistFormValues) => {
        console.log("Checklist Data:", data);
        if (onSuccess) {
            onSuccess(data);
        }
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px] w-full">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold">Agregar checklist</DialogTitle>
                    <DialogDescription className="text-black font-medium text-base">
                        Para agregar un checklist a este mantenimiento puede <strong>exportar desde una plantilla</strong> o <strong>crear un nuevo checklist.</strong>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Dropdown Escoger */}
                            <FormField
                                control={form.control}
                                name="opcion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-black" >Escoger</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-gray-100 border-gray-300">
                                                    <SelectValue placeholder="Seleccione una opción" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Nuevo">Nuevo</SelectItem>
                                                <SelectItem value="Plantilla">Plantilla</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Dropdown Plantilla - Conditional */}
                            {opcion === "Plantilla" && (
                                <FormField
                                    control={form.control}
                                    name="plantilla"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-black">Escoger Plantilla</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-gray-100 border-gray-300">
                                                        <SelectValue placeholder="Seleccione una plantilla" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Plantilla 1">Plantilla 1</SelectItem>
                                                    <SelectItem value="Plantilla 2">Plantilla 2</SelectItem>
                                                    <SelectItem value="Plantilla 3">Plantilla 3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        {/* Input Nombre de Checklist */}
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-black">Nombre de Checklist</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder=""
                                            className="border-gray-300 rounded-md"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="mr-2 hidden"
                                onClick={handleClose}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                className="bg-gema-green hover:bg-gema-green/90 text-primary-foreground px-8 font-semibold"
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
