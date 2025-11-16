// hooks/useGruposTrabajo.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  getGruposDeTrabajo, 
  createGrupoDeTrabajo, 
  editGrupoDeTrabajo,
  deleteGrupoDeTrabajo 
} from "@/services/gruposDeTrabajo";

export const useGruposTrabajo = () => {
  return useQuery({
    queryKey: ["gruposTrabajo"],
    queryFn: getGruposDeTrabajo,
    select: (data) => data.data,
  });
};

export const useCreateGrupo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createGrupoDeTrabajo,
    onSuccess: () => {
      toast.success("Grupo creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["gruposTrabajo"] });
    },
    onError: (error: Error) => {
      console.error("Error al crear el grupo:", error);
      toast.error(error.message || "Error al crear el grupo");
    },
  });
};

// Similar para edit y delete...