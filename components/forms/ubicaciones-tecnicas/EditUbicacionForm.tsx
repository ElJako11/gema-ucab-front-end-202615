"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
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
    <Modal
      title="Editar Ubicación"
      isOpen={open}
      onClose={onClose}
      className="max-w-lg bg-white"
      contentClassName="pt-6"
    >
      <div className="space-y-2 pb-2">
        <Label>Descripción</Label>
        <Input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Nueva descripción"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!descripcion.trim() || updateMutation.isPending}
          className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground"
        >
          {updateMutation.isPending ? "Guardando cambios..." : "Guardar cambios"}
        </Button>
      </div>
    </Modal>
  );
};

export default EditUbicacionForm;
