import { useQuery } from "@tanstack/react-query";
import { getChecklistItems } from "@/lib/api/checklist";

export const useGetAllChecklistItem = (type: string, checklistId: number, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["checklistItems", type, checklistId],
        queryFn: () => getChecklistItems(type, checklistId),
        enabled: options?.enabled,
    });
};  