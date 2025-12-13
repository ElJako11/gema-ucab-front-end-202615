import React, { useState } from 'react';
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComboSelectInput } from "@/components/ui/comboSelectInput"; // Using existing component for location if needed

interface InspectionFormModalProps {
    open: boolean;
    onClose: () => void;
    // Intentionally loose for now as we don't have the full types integration in this pass
    initialValues?: any;
}

export const InspectionFormContent: React.FC<{ initialValues?: any, onClose?: () => void }> = ({ initialValues, onClose }) => {
    const [frequency, setFrequency] = useState('');

    // Mock data for dropdowns
    const estados = ['Programado', 'En Proceso', 'Realizado', 'Cancelado'];
    const frecuencias = ['Diario', 'Semanal', 'Mensual', 'Anual']; // Removed Personalizado
    const encargados = ['Juan Pérez', 'Maria Garcia', 'Carlos Lopez', 'Ana Rodriguez'];
    const ubicaciones = ['Edificio A', 'Sala de Máquinas', 'Planta Baja', 'Laboratorio', 'Oficina 101'];

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                {/* State */}
                <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select defaultValue={initialValues?.estado}>
                        <SelectTrigger id="estado">
                            <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {estados.map((e) => (
                                <SelectItem key={e} value={e.toLowerCase()}>{e}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Supervision */}
                <div className="space-y-2">
                    <Label htmlFor="supervision">Supervisión</Label>
                    <Select defaultValue={initialValues?.supervision}>
                        <SelectTrigger id="supervision">
                            <SelectValue placeholder="Seleccionar encargado" />
                        </SelectTrigger>
                        <SelectContent>
                            {encargados.map((enc) => (
                                <SelectItem key={enc} value={enc}>{enc}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Technical Location */}
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="ubicacion">Ubicación Técnica</Label>
                    <Select defaultValue={initialValues?.ubicacion}>
                        <SelectTrigger id="ubicacion">
                            <SelectValue placeholder="Seleccionar ubicación técnica" />
                        </SelectTrigger>
                        <SelectContent>
                            {ubicaciones.map((ubi) => (
                                <SelectItem key={ubi} value={ubi}>{ubi}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Frequency */}
                <div className="space-y-2">
                    <Label htmlFor="frecuencia">Frecuencia</Label>
                    <Select onValueChange={setFrequency} defaultValue={initialValues?.frecuencia}>
                        <SelectTrigger id="frecuencia">
                            <SelectValue placeholder="Seleccionar frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                            {frecuencias.map((f) => (
                                <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Dynamic "Every X" */}
                {frequency && (
                    <div className="space-y-2">
                        <Label htmlFor="cada-cuanto">Cada cuánto</Label>
                        <div className="flex gap-2">
                            <Input type="number" min="0" id="cada-cuanto" className="w-20" placeholder="1" />
                            <span className="flex items-center text-sm text-gray-500">
                                {frequency === 'diario' ? 'días' :
                                    frequency === 'semanal' ? 'semanas' :
                                        frequency === 'mensual' ? 'meses' :
                                            frequency === 'anual' ? 'años' : 'unidades'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Observation - Full Width */}
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="observacion">Observación</Label>
                    <Textarea
                        id="observacion"
                        placeholder="Ingrese observaciones de la inspección"
                        className="min-h-[100px]"
                        defaultValue={initialValues?.observacion}
                    />
                </div>

            </div>

            <div className="flex justify-end gap-2 mt-4">
                {onClose && <Button variant="outline" onClick={onClose}>Cancelar</Button>}
                <Button className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground">Guardar</Button>
            </div>
        </>
    );
};

export const InspectionFormModal: React.FC<InspectionFormModalProps> = ({ open, onClose, initialValues }) => {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={<span className="text-xl font-semibold">Inspección</span>}
            className="bg-white max-w-4xl" // Wider modal
        >
            <InspectionFormContent onClose={onClose} initialValues={initialValues} />
        </Modal>
    );
};
