import { useQuery } from "@tanstack/react-query";
import { getChecklistItems } from "@/lib/api/checklist";

export const useGetAllChecklistItem = (type: string,checklistId: number) => {
    return useQuery({
        queryKey: ["checklistItems",type,checklistId],      
        queryFn: () => getChecklistItems(type,checklistId),
    });
};  