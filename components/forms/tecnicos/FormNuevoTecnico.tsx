'use client';

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
import { toast } from "sonner"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTecnico } from "@/services/tecnicos";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Esquema de validación
const tecnicoSchema = z.object({
  Nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  Correo: z
    .string()
    .email("Correo inválido")
    .regex(
      /^[a-zA-Z0-9._%+-]+@ucab\.edu\.ve$/,
      "Debe ser un correo institucional @ucab.edu.ve"
    ),
});

type TecnicoForm = z.infer<typeof tecnicoSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FormNuevoTecnico: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  
  const form = useForm<TecnicoForm>({
    resolver: zodResolver(tecnicoSchema),
    defaultValues: {
      Nombre: "",
      Correo: "",
    },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: createTecnico,
    onSuccess: () => {
      toast.success("Técnico creado exitosamente");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["tecnicos"] });
      onClose();
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Error creando técnico:", error);
      toast.error(
        error.message || "Error al crear el técnico. Intente nuevamente."
      );
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    mutation.mutate(values);
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full" contentClassName="space-y-2">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Técnico</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="Nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ejemplo: Juan Pérez"
                      autoComplete="name"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="Correo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo institucional</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ejemplo@ucab.edu.ve"
                      autoComplete="email"
                      type="email"
                      {...field}
                      disabled={mutation.isPending}
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
                disabled={mutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gema-green hover:bg-green-700 text-white"
                disabled={mutation.isPending || !form.formState.isValid}
              >
                {mutation.isPending ? "Creando..." : "Crear Técnico"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FormNuevoTecnico;