'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUpdateGrupo } from "@/hooks/grupos-trabajo/useEditGrupo";
import { Combobox } from "@/components/ui/combobox";
import { useSupervisores } from "@/hooks/usuarios/useUsuarios";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { type GrupoTrabajo } from "@/types/grupostrabajo.types";
import { grupoTrabajoSchema, type GrupoTrabajoForm } from "@/lib/validations/grupoTrabajoSchema";
const AREA_OPTIONS = ["Electricidad", "Infraestructura", "Mecanica", "Refrigeracion", "Logistica"] as const;

export interface EditGrupoFormProps {
  grupo: GrupoTrabajo | null;
  setGrupo: (grupo: GrupoTrabajo | null) => void;
}

export const EditGrupoForm: React.FC<EditGrupoFormProps> = ({
  grupo,
  setGrupo,
}) => {
  const form = useForm<GrupoTrabajoForm>({
    resolver: zodResolver(grupoTrabajoSchema),
    defaultValues: {
      codigo: grupo?.codigo || "",
      nombre: grupo?.nombre || "",
      supervisor: grupo?.supervisorId ? String(grupo.supervisorId) : "",
      area: grupo?.area || "",
    },
  });

  const updateGrupoMutation = useUpdateGrupo();
  const { supervisores, isLoading: isLoadingSupervisores } = useSupervisores();

  const handleSubmit = (values: GrupoTrabajoForm) => {
    if (!grupo) return;

    updateGrupoMutation.mutate({
      id: grupo.id,
      data: {
        codigo: values.codigo,
        nombre: values.nombre,
        supervisorId: Number(values.supervisor),
        area: values.area,
      }
    }, {
      onSuccess: () => {
        form.reset();
        setGrupo(null);
      }
    });
  };

  return (
    <Dialog open={!!grupo} onOpenChange={(open) => { if (!open) setGrupo(null); }}>
      <DialogContent contentClassName="pt-6">
        <DialogHeader className="pb-2">
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
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un área" />
                    </SelectTrigger>
                    <SelectContent>
                      {AREA_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      data={supervisores?.map((s) => ({
                        value: s.id,
                        label: `${s.nombre} (${s.correo})`,
                      })) || []}
                      value={field.value ? Number(field.value) : null}
                      onValueChange={(value) => field.onChange(value ? String(value) : "")}
                      placeholder={isLoadingSupervisores ? "Cargando supervisores..." : "Seleccione un supervisor"}
                      searchPlaceholder="Buscar supervisor..."
                      triggerClassName="w-full"
                      contentClassName="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setGrupo(null)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gema-green/80 hover:bg-gema-green"
                disabled={updateGrupoMutation.isPending}
              >
                {updateGrupoMutation.isPending ? "Guardando cambios..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};