import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChecklistItem } from "@/lib/api/checklist";
import { QUERY_KEYS } from "../consts/queryKeys";
import { toast } from "sonner";

export const useEliminarChecklistItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteChecklistItem,
        onSuccess: () => {
            toast.success("Item del checklist eliminado exitosamente");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHECKLIST_ITEMS });
        },
        onError: (error: Error) => {
            console.error("Error al eliminar el item del checklist:", error);
            toast.error(error.message || "Error al eliminar el item del checklist");
        }
    });
}