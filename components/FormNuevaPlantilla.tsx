'use client'

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlantilla, updatePlantilla } from "@/lib/plantillas";
import type { Plantilla } from "@/types/models/plantillas.types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Esquema de validación
const plantillaSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  tipo: z.string().min(1, "Debe seleccionar un tipo de plantilla"),
});

type PlantillaForm = z.infer<typeof plantillaSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: Plantilla | null;
}

const FormNuevaPlantilla: React.FC<Props> = ({ open, onClose, initialData }) => {
  const queryClient = useQueryClient();

  const form = useForm<PlantillaForm>({
    resolver: zodResolver(plantillaSchema),
    defaultValues: {
      nombre: "",
      tipo: "Checklist",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          nombre: initialData.plantilla, // Mapear propiedad plantilla a nombre
          tipo: initialData.tipo,
        });
      } else {
        form.reset({
          nombre: "",
          tipo: "Checklist",
        });
      }
    }
  }, [open, initialData, form]);

  const mutation = useMutation({
    mutationFn: async (data: PlantillaForm) => {
      const payload = { plantilla: data.nombre, tipo: data.tipo };
      if (initialData) {
        return await updatePlantilla(initialData.id, payload);
      } else {
        return await createPlantilla(payload);
      }
    },
    onSuccess: () => {
      toast.success(initialData ? "Plantilla actualizada exitosamente" : "Plantilla creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["plantillas"] });
      form.reset();
      onClose();
    },
    onError: (error: Error) => {
      console.error("Error guardando plantilla:", error);
      toast.error("Error al guardar la plantilla");
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (data: PlantillaForm) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Plantilla" : "Nueva Plantilla"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la plantilla</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Mantenimiento de Aire Acondicionado"
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
                  <FormLabel>Tipo de plantilla</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-100">
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Checklist">Checklist</SelectItem>
                      <SelectItem value="Mantenimiento por Condición">
                        Mantenimiento por Condición
                      </SelectItem>
                      <SelectItem value="Mantenimiento por Inspección">
                        Mantenimiento por Inspección
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={mutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gema-green hover:bg-green-700"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FormNuevaPlantilla;
