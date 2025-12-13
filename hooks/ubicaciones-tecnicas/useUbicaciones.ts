import { useQuery } from "@tanstack/react-query";
import { ubicacionesAPI } from "@/lib/api/ubicacionesTecnicas";

export const useUbicaciones = () => {
    return useQuery({
        queryKey: ["ubicaciones"],
        queryFn: ubicacionesAPI.getUbicacionesTecnicas,
        select: (data) => data.data,
    });
};
