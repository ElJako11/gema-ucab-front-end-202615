'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateGrupo } from "@/hooks/grupos-trabajo/useCreateGrupo";
import { Combobox } from "@/components/ui/combobox";

const grupoTrabajoSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"), 
  nombre: z.string().min(1, "El nombre es requerido"),
  supervisor: z.string().min(1, "El supervisor es requerido"),
  area: z.string().min(1, "El área es requerida"),
});

interface CreateGrupoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tecnicosDisponibles: any[];
}

export const CreateGrupoForm: React.FC<CreateGrupoFormProps> = ({
  open,
  onOpenChange,
  tecnicosDisponibles,
}) => {
  const form = useForm<z.infer<typeof grupoTrabajoSchema>>({
    resolver: zodResolver(grupoTrabajoSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      supervisor: "",
      area: "",
    },
  });

  const createGrupoMutation = useCreateGrupo();

  const handleSubmit = (values: z.infer<typeof grupoTrabajoSchema>) => {
    createGrupoMutation.mutate({
      codigo: values.codigo,
      nombre: values.nombre,
      supervisorId: Number(values.supervisor),
      area: values.area,
    }, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Grupo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Ejemplo: SGMREF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Grupo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ejemplo: Grupo de Mantenimiento de Refrigeración"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ejemplo: Mantenimiento, Producción, Calidad"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <FormControl>
                    <Combobox
                      data={tecnicosDisponibles.map((tecnico) => ({
                        value: tecnico.Id,
                        label: `${tecnico.Nombre} (${tecnico.Correo})`,
                      }))}
                      value={field.value ? Number(field.value) : null}
                      onValueChange={(value) => field.onChange(value ? String(value) : "")}
                      placeholder="Seleccione un supervisor"
                      searchPlaceholder="Buscar supervisor..."
                      triggerClassName="w-full"
                      contentClassName="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gema-green/80 hover:bg-gema-green"
                disabled={createGrupoMutation.isPending}
              >
                {createGrupoMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};