import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ubicacionesTecnicasAPI } from "@/lib/api/ubicacionesTecnicas";

export const useCreateUbicacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            console.log("🔄 Enviando datos al API:", data);
            try {
                const result = await ubicacionesTecnicasAPI.create(data);
                console.log("✅ Respuesta exitosa del API:", result);
                return result;
            } catch (error) {
                console.error("❌ Error en API:", error);
                throw error;
            }
        },
        onSuccess: (data) => {
            console.log("✅ Mutación exitosa:", data);
            queryClient.invalidateQueries({ queryKey: ["ubicacionesTecnicas"] });
            // No mostrar toast aquí, se maneja en el componente
        },
        onError: (error: any) => {
            console.error("❌ Error en mutación:", error);
            // No mostrar toast aquí, se maneja en el componente
        },
    });
};
