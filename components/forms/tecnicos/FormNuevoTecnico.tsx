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
import { useCreateTecnico } from "@/hooks/tecnicos/useCreateTecnico";
import { useGrupos } from "@/hooks/grupos-trabajo/useGrupoTrabajo";

// Esquema de validación
const tecnicoSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  correo: z
    .string()
    .email("Correo inválido")
    .regex(
      /^[a-zA-Z0-9._%+-]+@ucab\.edu\.ve$/,
      "Debe ser un correo institucional @ucab.edu.ve"
    ),
  idGrupo: z.number().min(1, "Selecciona un grupo de trabajo"),
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
      nombre: "",
      correo: "",
      idGrupo: 0,
    },
  });

  // Usamos el hook centralizado
  const mutation = useCreateTecnico();
  const { data: grupos } = useGrupos();

  // Función para manejar el envío
  const onSubmit = (values: TecnicoForm) => {
    // Mapeamos los datos del formulario (zod) a la estructura que espera la API
    const payload = {
      nombre: values.nombre,
      correo: values.correo,
      idGT: values.idGrupo
    };
    
    mutation.mutate(payload, {
      onSuccess: () => {
        // Solo nos encargamos de limpiar la UI, el hook ya muestra el toast
        form.reset();
        onClose();
      },

      onError: (error) => {
        console.error("Error al crear tecnico: ", error);
      }
      // No necesitamos onError aquí, el hook ya muestra el toast de error
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
                    defaultValue={field.value?.toString()}
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
