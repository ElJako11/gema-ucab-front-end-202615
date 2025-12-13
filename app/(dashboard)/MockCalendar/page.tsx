'use client';

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InspectionFormContent, InspectionFormModal } from "@/components/forms/inspecciones/InspectionFormModal";
import { MaintenanceFormContent } from "@/components/forms/mantenimientos/MaintenanceFormContent";
import { MaintenanceSummaryModal } from "@/components/forms/mantenimientos/MaintenanceSummaryModal";
import { InspectionSummaryModal } from "@/components/forms/inspecciones/InspectionSummaryModal";
import { EditMaintenanceModal } from "@/components/forms/mantenimientos/EditMaintenanceModal";
import { EditInspectionModal } from "@/components/forms/inspecciones/EditInspectionModal";
import { DeleteMaintenanceModal } from "@/components/forms/mantenimientos/DeleteMaintenanceModal";
import { DeleteInspectionModal } from "@/components/forms/inspecciones/DeleteInspectionModal";
import { ConfirmUpdateMaintenanceModal } from "@/components/forms/mantenimientos/ConfirmUpdateMaintenanceModal";
import { ConfirmUpdateInspectionModal } from "@/components/forms/inspecciones/ConfirmUpdateInspectionModal";

export default function MockCalendar() {
    // Original State
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [type, setSelectedType] = useState(0);
    const [frequency, setSelectedFrequency] = useState("vacio");

    // Verification Modals State
    const [openModal1, setOpenModal1] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);
    const [openModal3, setOpenModal3] = useState(false);
    const [openModal4, setOpenModal4] = useState(false);
    const [openModal5, setOpenModal5] = useState(false);
    const [openModal6, setOpenModal6] = useState(false);
    const [openModal7, setOpenModal7] = useState(false);
    const [openConfirmUpdateMaint, setOpenConfirmUpdateMaint] = useState(false);
    const [openConfirmUpdateInsp, setOpenConfirmUpdateInsp] = useState(false);

    useEffect(() => {
        console.log(type);
    }, [type]);

    useEffect(() => {
        console.log(frequency);
    }, [frequency]);

    return (
        <div className="p-4 space-y-8">
            <section className="space-y-4">
                <h1 className="text-2xl font-bold">MockCalendar - Original Modals</h1>

                <div className="flex gap-4 flex-wrap">
                    <Button onClick={() => setIsOpen1(true)}>Open Modal Crear</Button>
                    <Button onClick={() => setIsOpen2(true)}>Open Modal Genérico 1</Button>
                    <Button onClick={() => setIsOpen3(true)}>Open Modal Genérico 2</Button>
                </div>

                <Modal
                    title="Agregar elemento"
                    isOpen={isOpen1}
                    onClose={() => setIsOpen1(false)}
                    className="bg-white max-w-4xl"
                >
                    <div>
                        <div className="my-4">
                            <label className="block text-sm font-medium mb-1">Elemento a agregar</label>
                            <Select onValueChange={(value) => setSelectedType(parseInt(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo de elemento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Mantenimiento</SelectItem>
                                    <SelectItem value="2">Inspección</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {type === 1 && <MaintenanceFormContent />}
                        {type === 2 && <InspectionFormContent />}
                    </div>
                </Modal>

                <Modal
                    title="Modal Title"
                    description="Modal Description"
                    isOpen={isOpen2}
                    onClose={() => setIsOpen2(false)}
                >
                    <div>Modal Content 2</div>
                </Modal>

                <Modal
                    title="Modal Title"
                    description="Modal Description"
                    isOpen={isOpen3}
                    onClose={() => setIsOpen3(false)}
                >
                    <div>Modal Content 3</div>
                </Modal>
            </section>

            <hr className="border-t-2" />

            <section>
                <h1 className="text-2xl font-bold mb-6">Pruebas de Modales (Nuevos)</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded shadow-sm">
                        <h2 className="font-semibold mb-2">Modal 1: Formulario Inspección</h2>
                        <Button onClick={() => setOpenModal1(true)} className="w-full">Abrir Inspección</Button>
                        <InspectionFormModal open={openModal1} onClose={() => setOpenModal1(false)} />
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <h2 className="font-semibold mb-2">Modal 2: Resumen Mantenimiento</h2>
                        <Button onClick={() => setOpenModal2(true)} className="w-full">Abrir Resumen Mant.</Button>
                        <MaintenanceSummaryModal
                            open={openModal2}
                            onClose={() => setOpenModal2(false)}
                            data={{
                                estado: 'Programado',
                                prioridad: 'Alta',
                                frecuencia: 'Mensual',
                                repeticion: 'Sí',
                                ubicacion: 'Edificio A > Sala de Máquinas',
                                fechaLimite: '2025-12-31'
                            }}
                        />
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <h2 className="font-semibold mb-2">Modal 3: Resumen Inspección</h2>
                        <Button onClick={() => setOpenModal3(true)} className="w-full">Abrir Resumen Insp.</Button>
                        <InspectionSummaryModal
                            open={openModal3}
                            onClose={() => setOpenModal3(false)}
                            data={{
                                estado: 'Realizado',
                                supervisor: 'Ana Gómez',
                                area: 'Higiene y Seguridad',
                                ubicacion: 'Laboratorio Química',
                                observacion: 'Todo en orden, revisar extintores el próximo mes.',
                                frecuencia: 'Trimestral'
                            }}
                        />
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <h2 className="font-semibold mb-2">Modal 4: Editar Mantenimiento</h2>
                        <Button onClick={() => setOpenModal4(true)} className="w-full">Formulario Edición Mant.</Button>
                        <EditMaintenanceModal
                            open={openModal4}
                            onClose={() => setOpenModal4(false)}
                            onConfirm={() => { alert('Editando...'); setOpenModal4(false); }}
                            maintenanceName="Mantenimiento de Aires Acondicionados"
                        />
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <h2 className="font-semibold mb-2">Modal 5: Editar Inspección</h2>
                        <Button onClick={() => setOpenModal5(true)} className="w-full">Formulario Edición Insp.</Button>
                        <EditInspectionModal
                            open={openModal5}
                            onClose={() => setOpenModal5(false)}
                            onConfirm={() => { alert('Editando...'); setOpenModal5(false); }}
                            inspectionName="Inspección de Seguridad #123"
                        />
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <h2 className="font-semibold mb-2">Modal 6: Eliminar Mantenimiento</h2>
                        <Button variant="destructive" onClick={() => setOpenModal6(true)} className="w-full">Eliminar Mantenimiento</Button>
                        <DeleteMaintenanceModal
                            open={openModal6}
                            onClose={() => setOpenModal6(false)}
                            onConfirm={() => { alert('Eliminando...'); setOpenModal6(false); }}
                            maintenanceName="Mantenimiento Preventivo XYZ"
                        />
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <h2 className="font-semibold mb-2">Modal 7: Eliminar Inspección</h2>
                        <Button variant="destructive" onClick={() => setOpenModal7(true)} className="w-full">Eliminar Inspección</Button>
                        <DeleteInspectionModal
                            open={openModal7}
                            onClose={() => setOpenModal7(false)}
                            onConfirm={() => { alert('Eliminando...'); setOpenModal7(false); }}
                            inspectionName="Inspección Rutinaria Dic 2025"
                        />
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <h2 className="font-semibold mb-2">Modal 8: Confirmar Mod. Mant.</h2>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setOpenConfirmUpdateMaint(true)}>Confirmar Modificación</Button>
                        <ConfirmUpdateMaintenanceModal
                            open={openConfirmUpdateMaint}
                            onClose={() => setOpenConfirmUpdateMaint(false)}
                            onConfirm={() => { alert('Actualizado!'); setOpenConfirmUpdateMaint(false); }}
                            maintenanceName="Mantenimiento 2025"
                        />
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <h2 className="font-semibold mb-2">Modal 9: Confirmar Mod. Insp.</h2>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setOpenConfirmUpdateInsp(true)}>Confirmar Modificación</Button>
                        <ConfirmUpdateInspectionModal
                            open={openConfirmUpdateInsp}
                            onClose={() => setOpenConfirmUpdateInsp(false)}
                            onConfirm={() => { alert('Actualizado!'); setOpenConfirmUpdateInsp(false); }}
                            inspectionName="Inspección 2025"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}