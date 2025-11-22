'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditGrupo } from "@/hooks/grupos-trabajo/useEditGrupo";
import { type Tecnico } from "@/types/tecnicos.types";
import { type GrupoTrabajo } from "@/types/grupostrabajo.types";

const grupoTrabajoSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  supervisor: z.string().min(1, "El supervisor es requerido"),
});

export interface EditGrupoFormProps {
  grupo: GrupoTrabajo | null;
  setGrupo: (grupo: GrupoTrabajo | null) => void;
  tecnicosDisponibles: Tecnico[];
}

export const EditGrupoForm: React.FC<EditGrupoFormProps> = ({
  grupo,
  setGrupo,
  tecnicosDisponibles,
}) => {
  const form = useForm<z.infer<typeof grupoTrabajoSchema>>({
    resolver: zodResolver(grupoTrabajoSchema),
    defaultValues: {
      codigo: grupo?.codigo || "",
      nombre: grupo?.nombre || "",
      supervisor: grupo?.supervisorId ? String(grupo.supervisorId) : "",
    },
  });

  const editGrupoMutation = useEditGrupo();

  const handleSubmit = (values: z.infer<typeof grupoTrabajoSchema>) => {
    if (!grupo) return;

    editGrupoMutation.mutate({
      id: grupo.id,
      codigo: values.codigo,
      nombre: values.nombre,
      supervisorId: Number(values.supervisor),
    }, {
      onSuccess: () => {
        form.reset();
        setGrupo(null);
      }
    });
  };

  return (
    <Dialog open={!!grupo} onOpenChange={(open) => { !open && setGrupo(null) }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Grupo</DialogTitle>
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
              name="supervisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un supervisor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tecnicosDisponibles.map((sup) => (
                        <SelectItem key={sup.Id} value={String(sup.Id)}>
                          {sup.Nombre} ({sup.Correo})
                        </SelectItem>
                      ))}
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
                onClick={() => setGrupo(null)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gema-green hover:bg-green-700"
                disabled={editGrupoMutation.isPending}
              >
                {editGrupoMutation.isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};