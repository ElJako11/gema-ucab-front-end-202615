'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    isOpen: boolean;
    onClose: (open: boolean) => void;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children,
    className,
    contentClassName,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className={className}
                contentClassName={cn("pt-6", contentClassName)}
            >
                <DialogHeader className="pb-2">
                    <DialogTitle>{title}</DialogTitle>
                    {description && (
                        <DialogDescription className="pb-6">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <div>{children}</div>
            </DialogContent>
        </Dialog>
    );
};
