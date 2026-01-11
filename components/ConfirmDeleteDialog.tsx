'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    isLoading?: boolean;
}

export default function ConfirmDeleteDialog({
    open,
    onClose,
    onConfirm,
    title,
    description,
    isLoading = false,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[425px] pb-6" contentClassName="pt-6">
                <DialogHeader className="pb-2">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="pb-6">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Eliminando..." : "Eliminar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
