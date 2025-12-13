'use client'

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useCreateTecnico } from "@/hooks/tecnicos/useCreateTecnico";

// Esquema de validación
const tecnicoSchema = z.object({
  Nombre: z.string().min(2, "El nombre es requerido"),
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
  // Puedes pasar una función para crear el técnico, o usar tu propio hook/mutation
  onCreate?: (data: TecnicoForm) => Promise<unknown>;
}

const FormNuevoTecnico: React.FC<Props> = ({ open, onClose }) => {
  // Eliminamos useQueryClient manual porque el hook ya lo maneja
  const form = useForm<TecnicoForm>({
    resolver: zodResolver(tecnicoSchema),
    defaultValues: {
      Nombre: "",
      Correo: "",
    },
  });

  // Usamos el hook centralizado
  const mutation = useCreateTecnico();

  // Función para manejar éxito y errores (se puede pasar al hook también, pero aquí es válido para toast/reset)
  const onSubmit = (values: TecnicoForm) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success("Técnico creado exitosamente");
        form.reset();
        onClose();
        // invalidación ya está en el hook
      },
      onError: (error: unknown) => {
        if (error instanceof Error) {
          // Ajustar mensaje según error
          toast.error(error?.message || "Error al crear el técnico");
        } else {
          toast.error("Error al crear el técnico");
        }
      },
    });
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      id="Nombre"
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
              name="Correo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo institucional</FormLabel>
                  <FormControl>
                    <Input
                      id="Correo"
                      placeholder="ejemplo@ucab.edu.ve"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground"
                type="submit"
                disabled={mutation.isPending}
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
