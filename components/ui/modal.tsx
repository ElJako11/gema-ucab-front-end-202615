'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
    title: React.ReactNode;
    description?: string;
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
            <DialogContent className={className} contentClassName={contentClassName}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div>{children}</div>
            </DialogContent>
        </Dialog>
    );
};
