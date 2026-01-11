import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../form";
import { useUpdateChecklist } from "@/hooks/checklist/useUpdateChecklist";

const formSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
});

interface EditarChecklistFormProps {
    open: boolean;
    onClose: () => void;
    checklistId: number;
    currentName: string;
}

export const EditarChecklistForm: React.FC<EditarChecklistFormProps> = ({
    open,
    onClose,
    checklistId,
    currentName,
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: currentName,
        },
    });

    const { reset } = form;
    const updateChecklist = useUpdateChecklist();

    useEffect(() => {
        if (open) {
            reset({ nombre: currentName });
        }
    }, [open, currentName, reset]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        updateChecklist.mutate({ id: checklistId, nombre: values.nombre }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar nombre de checklist</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-gema-green hover:bg-gema-green/90 text-white" disabled={updateChecklist.isPending}>
                                {updateChecklist.isPending ? "Guardando..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
