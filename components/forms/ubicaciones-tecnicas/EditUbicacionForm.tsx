import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ✅ Usar hook organizado
import { useUpdateUbicacion } from "@/hooks/ubicaciones-tecnicas/useUpdateUbicacion";

interface EditUbicacionProps {
  open: boolean;
  onClose: () => void;
  idUbicacion: number;
  descripcionOriginal?: string;
}

const EditUbicacionForm: React.FC<EditUbicacionProps> = ({
  open,
  onClose,
  idUbicacion,
  descripcionOriginal,
}) => {
  const [descripcion, setDescripcion] = useState(descripcionOriginal || "");

  // ✅ Usar hook organizado
  const updateMutation = useUpdateUbicacion();

  const handleClose = () => {
    setDescripcion(descripcionOriginal || "");
    onClose();
  };

  const onSubmit = () => {
    if (!descripcion.trim()) {
      toast.error("La descripción no puede estar vacía");
      return;
    }

    // ✅ Usar hook de actualización con tipado correcto
    updateMutation.mutate(
      { 
        id: idUbicacion, 
        data: { descripcion: descripcion.trim() } 
      },
      {
        onSuccess: () => {
          handleClose();
          // El toast ya se maneja en el hook
        },
        onError: (error) => {
          // El toast de error ya se maneja en el hook, pero podemos agregar lógica específica aquí si es necesario
          console.error("Error específico del formulario:", error);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-white">
        <DialogTitle className="text-lg font-semibold mb-4">
          Editar Ubicación Técnica
        </DialogTitle>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Input
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ingrese la nueva descripción"
              disabled={updateMutation.isPending}
              className="w-full"
            />
          </div>

          {/* Mostrar error si existe */}
          {updateMutation.isError && (
            <p className="text-red-600 text-sm">
              {updateMutation.error instanceof Error 
                ? updateMutation.error.message 
                : "Error al actualizar la ubicación técnica"
              }
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={updateMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!descripcion.trim() || updateMutation.isPending}
            className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground"
          >
            {updateMutation.isPending ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUbicacionForm;
