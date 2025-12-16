'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteUsuario } from "@/hooks/usuarios/useDeleteUsuario";

interface EliminarUsuarioFormProps {
    usuario: any;
    setUsuario: (usuario: any | null) => void;
}

export const EliminarUsuarioForm: React.FC<EliminarUsuarioFormProps> = ({
    usuario,
    setUsuario,
}) => {
    const deleteUsuarioMutation = useDeleteUsuario();

    const handleDelete = () => {
        if (!usuario) return;
        deleteUsuarioMutation.mutate(usuario.id || usuario.Id, {
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Usuario</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro que deseas eliminar al usuario <strong>{usuario?.nombre || usuario?.Nombre}</strong>? Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
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
