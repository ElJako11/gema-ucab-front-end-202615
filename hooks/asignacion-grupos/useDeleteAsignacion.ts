import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { asignacionGruposAPI } from "@/lib/api/asignacion-grupos";

export const useDeleteAsignacion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (asignacionId: number) => asignacionGruposAPI.delete(asignacionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asignaciones"] });
      queryClient.invalidateQueries({ queryKey: ["trabajadoresPorGrupo"] });
      toast.success("Técnico removido del grupo correctamente");
    },
    onError: (error: any) => {
      console.error("Error al remover técnico:", error);
      toast.error("Error al remover técnico del grupo");
    },
  });
};

// Hook para eliminar asignación por técnico y grupo usando la ruta correcta
export const useDeleteAsignacionByTecnicoGrupo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ tecnicoId, grupoId }: { tecnicoId: number; grupoId: number }) => 
      asignacionGruposAPI.deleteByTecnicoAndGrupo(tecnicoId, grupoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asignaciones"] });
      queryClient.invalidateQueries({ queryKey: ["trabajadoresPorGrupo"] });
      toast.success("Técnico removido del grupo correctamente");
    },
    onError: (error: any) => {
      console.error("Error al remover técnico:", error);
      toast.error("Error al remover técnico del grupo");
    },
  });
};