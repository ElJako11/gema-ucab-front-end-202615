import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ubicacionesTecnicasAPI } from "@/lib/api/ubicacionesTecnicas";

export const useCreateUbicacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            try {
                const result = await ubicacionesTecnicasAPI.create(data);
                return result;
            } catch (error) {
                console.error("❌ Error en API:", error);
                throw error;
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["ubicacionesTecnicas"] });
            // No mostrar toast aquí, se maneja en el componente
        },
        onError: (error: any) => {
            console.error("❌ Error en mutación:", error);
            // No mostrar toast aquí, se maneja en el componente
        },
    });
};
