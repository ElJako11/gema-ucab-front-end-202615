import { useQuery } from "@tanstack/react-query";
import { getChecklistItems } from "@/lib/api/checklist";

export const useGetAllChecklistItem = (checklistId: number) => {
    return useQuery({
        queryKey: ["checklistItems",checklistId],      
        queryFn: () => getChecklistItems(checklistId),
    });
};  