import { useQuery } from "@tanstack/react-query";
import { getPlantillas } from "@/lib/api/plantillas";

export const useGetPlantillas = () => {
    return useQuery({
        queryKey: ["plantillas"],      
        queryFn: () => getPlantillas(),
    }); 
}