import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
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
import { useGetPlantillas } from "@/hooks/plantillas/useGetPlantillas";
import { useCreateChecklist } from "@/hooks/checklist/useCreateChecklist";
import { useCreateChecklisfromPlantilla } from "@/hooks/checklist/useCreateChecklisfromPlantilla";

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
    onSuccess?: (data: any) => void;
    maintenanceId: number;
    type: "mantenimientos" | "inspecciones";
}

export const AgregarChecklistForm: React.FC<AgregarChecklistFormProps> = ({
    open,
    onClose,
    onSuccess,
    maintenanceId,
    type
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

    const router = useRouter();

    // Hooks for creating checklist
    const createNewChecklist = useCreateChecklist();
    const createFromPlantilla = useCreateChecklisfromPlantilla();

    const onSubmit = (data: ChecklistFormValues) => {
        if (data.opcion === "Nuevo") {
            createNewChecklist.mutate({
                idInspeccion: type === "inspecciones" ? maintenanceId : 0,
                idMantenimiento: type === "mantenimientos" ? maintenanceId : 0,
                nombre: data.nombre!
            }, {
                onSuccess: () => {
                    console.log("Checklist created successfully");
                    if (onSuccess) onSuccess(data);
                    handleClose();
                    router.push(`/detalle-trabajo/${type}/${maintenanceId}`);
                },
                onError: (error) => {
                    console.error("Error creating checklist:", error);
                }
            });
        } else {
            if (data.plantilla) {
                createFromPlantilla.mutate({
                    idMantenimiento: type === "mantenimientos" ? maintenanceId : 0,
                    idInspeccion: type === "inspecciones" ? maintenanceId : 0,
                    idPlantilla: data.plantilla
                }, {
                    onSuccess: () => {
                        console.log("Checklist created from template successfully");
                        if (onSuccess) onSuccess(data);
                        handleClose();
                        router.push(`/detalle-trabajo/${type}/${maintenanceId}`);
                    },
                    onError: (error) => {
                        console.error("Error creating checklist from template:", error);
                    }
                });
            }
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    //Usar el hook para obtener las plantillas
    const { data: plantillas, isLoading, isError } = useGetPlantillas();

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
                                                    {isLoading ? (
                                                        <SelectItem value="loading" disabled>Cargando plantillas...</SelectItem>
                                                    ) : isError ? (
                                                        <SelectItem value="error" disabled>Error al cargar</SelectItem>
                                                    ) : plantillas && plantillas.length > 0 ? (
                                                        plantillas.map((plantilla: any) => (
                                                            <SelectItem key={plantilla.idPlantilla} value={plantilla.idPlantilla.toString()}>
                                                                {plantilla.nombre}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="empty" disabled>No hay plantillas disponibles</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        {/* Input Nombre de Checklist */}
                        {opcion !== "Plantilla" && (
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
                        )}

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
                                disabled={createNewChecklist.isPending || createFromPlantilla.isPending}
                            >
                                {createNewChecklist.isPending || createFromPlantilla.isPending ? "Cargando..." : "Guardar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
