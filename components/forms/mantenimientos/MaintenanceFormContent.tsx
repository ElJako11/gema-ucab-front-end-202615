import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface MaintenanceFormContentProps {
    initialValues?: any;
    onClose?: () => void;
}

export const MaintenanceFormContent: React.FC<MaintenanceFormContentProps> = ({ initialValues, onClose }) => {
    const [frequency, setSelectedFrequency] = useState(initialValues?.repeticion === 'periodico' ? 'periodico' : 'unico');

    // Array de supervisores (mismo que en inspecciones)
    const encargados = ['Juan Pérez', 'Maria Garcia', 'Carlos Lopez', 'Ana Rodriguez'];

    return (
        <div className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-6 my-2">
                <div>
                    <Label>Prioridad</Label>
                    <Select defaultValue={initialValues?.prioridad}>
                        <SelectTrigger>
                            <SelectValue placeholder="Prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="baja">Baja</SelectItem>
                            <SelectItem value="media">Media</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Estado</Label>
                    <Select defaultValue={initialValues?.estado}>
                        <SelectTrigger>
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="no_empezado">No empezado</SelectItem>
                            <SelectItem value="reprogramado">Reprogramado</SelectItem>
                            <SelectItem value="en_ejecucion">En ejecuciones</SelectItem>
                            <SelectItem value="culminado">Culminado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Supervisor Asignado</Label>
                    <Select defaultValue={initialValues?.supervisor}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar supervisor" />
                        </SelectTrigger>
                        <SelectContent>
                            {encargados.map((enc) => (
                                <SelectItem key={enc} value={enc}>{enc}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Fecha de inicio</Label>
                    <Input type="date" className="w-full" defaultValue={initialValues?.fechaInicio} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Finalización</Label>
                    <Input type="date" className="w-full" defaultValue={initialValues?.fechaFin} />
                </div>
                <div>
                    <Label>Tipo de mantenimiento</Label>
                    <Select defaultValue={initialValues?.tipo}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tipo de mantenimiento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="preventivo">Preventivo</SelectItem>
                            <SelectItem value="correctivo">Correctivo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Repeticion</Label>
                    <Select onValueChange={(value: string) => setSelectedFrequency(value)} defaultValue={frequency}>
                        <SelectTrigger>
                            <SelectValue placeholder="Repeticion" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="unico">Unico</SelectItem>
                            <SelectItem value="periodico">Periodico</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {frequency === "periodico" && (
                    <div className="col-span-2 sm:col-span-1">
                        <Label>Frecuencia</Label>
                        <Select defaultValue={initialValues?.frecuencia}>
                            <SelectTrigger>
                                <SelectValue placeholder="Frecuencia" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="diario">Diario</SelectItem>
                                <SelectItem value="semanal">Semanal</SelectItem>
                                <SelectItem value="mensual">Mensual</SelectItem>
                                <SelectItem value="bimestral">Bimestral</SelectItem>
                                <SelectItem value="trimestral">Trimestral</SelectItem>
                                <SelectItem value="semestral">Semestral</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
                {onClose && <Button variant="outline" onClick={onClose}>Cancelar</Button>}
                <Button className="bg-gema-green/80 hover:bg-gema-green text-primary-foreground">Guardar</Button>
            </div>
        </div>
    );
};
