'use client'

import React, { useState } from 'react';
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateMantPorInspeccion } from '@/hooks/mantenimientos-por-inspeccion/useCreateMantDerivacion';
import { mantenimientosXInspeccion } from '@/lib/api/mantenimientosInspeccion';

interface DeriveMaintenanceModalProps {
    open: boolean;
    idInsp: number;
    onClose: () => void;
}

export const DeriveMaintenanceModal: React.FC<DeriveMaintenanceModalProps> = ({ open, idInsp, onClose }) => {
    const [nameInspeccion, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const mutation = useCreateMantPorInspeccion();

    const handleConfirm = async () => {

        const payload: mantenimientosXInspeccion = {
            id: idInsp,
            nombre: nameInspeccion
        }

        mutation.mutate(payload, {
            onSuccess: () => {
                // El hook ya muestra el toast de éxito
                setName('');
                onClose();
            }
            // El hook ya maneja el toast de error
        })
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
                        value={nameInspeccion}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-2">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="min-w-[100px]"
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button
                    className="bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-900 min-w-[100px] font-medium"
                    onClick={handleConfirm}
                    disabled={isLoading || !nameInspeccion.trim()}
                >
                    {isLoading ? "Derivando..." : "Derivar"}
                </Button>
            </div>
        </Modal>
    );
};
