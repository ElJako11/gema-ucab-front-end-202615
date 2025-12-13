import React, { useState } from 'react';
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeriveMaintenanceModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (name: string) => void;
}

export const DeriveMaintenanceModal: React.FC<DeriveMaintenanceModalProps> = ({ open, onClose, onConfirm }) => {
    const [name, setName] = useState('');

    const handleConfirm = () => {
        onConfirm(name);
        setName('');
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Derivar Mantenimiento</span>}
            className="bg-white max-w-md"
        >
            <div className="py-6 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="maintenance-name">Nombre del mantenimiento</Label>
                    <Input
                        id="maintenance-name"
                        placeholder="Ingrese el nombre del mantenimiento..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-2">
                <Button variant="outline" onClick={onClose} className="min-w-[100px]">
                    Cancelar
                </Button>
                <Button
                    className="bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-900 min-w-[100px] font-medium"
                    onClick={handleConfirm}
                >
                    Derivar
                </Button>
            </div>
        </Modal>
    );
};
