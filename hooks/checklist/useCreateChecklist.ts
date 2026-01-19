import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChecklist } from "@/lib/api/checklist";

type CreateParams = {
  idInspeccion: number;
  idMantenimiento: number;
  nombre: string;
};

export const useCreateChecklist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateParams) =>
      createChecklist(
        params.nombre,
        params.idInspeccion.toString(),
        params.idMantenimiento.toString(),
      ),
    onSuccess: async (_, variables) => {
      const type =
        variables.idMantenimiento > 0 ? "mantenimientos" : "inspecciones";
      const id =
        variables.idMantenimiento > 0
          ? variables.idMantenimiento
          : variables.idInspeccion;

      // Usamos await para asegurar que se dispare la recarga
      await queryClient.invalidateQueries({
        queryKey: ["checklistItems", type, id],
        refetchType: "active", // Fuerza la recarga inmediata de las consultas activas en pantalla
      });
    },
    onError: (error) => {
      console.error("Error al crear checklist:", error);
    },
  });
};
