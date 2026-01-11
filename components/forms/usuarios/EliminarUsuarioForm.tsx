'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteUsuario } from "@/hooks/usuarios/useDeleteUsuario";
import { Usuario } from "@/types/usuarios.types";

interface EliminarUsuarioFormProps {
    usuario: Usuario;
    setUsuario: (usuario: Usuario | null) => void;
}

export const EliminarUsuarioForm: React.FC<EliminarUsuarioFormProps> = ({
    usuario,
    setUsuario,
}) => {
    const deleteUsuarioMutation = useDeleteUsuario();

    const handleDelete = () => {
        if (!usuario) return;
        deleteUsuarioMutation.mutate(usuario.id, {
            onSuccess: () => {
                setUsuario(null);
            }
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) setUsuario(null);
    }

    return (
        <Dialog open={!!usuario} onOpenChange={handleOpenChange}>
            <DialogContent contentClassName="pt-6">
                <DialogHeader className="pb-2">
                    <DialogTitle>Eliminar Usuario</DialogTitle>
                    <DialogDescription className="pb-6">
                        ¿Estás seguro que deseas eliminar al usuario <strong>{usuario?.nombre}</strong>? Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setUsuario(null)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteUsuarioMutation.isPending}
                    >
                        {deleteUsuarioMutation.isPending ? "Eliminando..." : "Eliminar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
