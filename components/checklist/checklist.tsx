import type { Actividad, Checklist } from "@/types/checklist.types";
import Card from "./card";
import { EliminarChecklistItem } from "../forms/checklist/EliminarChecklistItemForm";
import { AgregarChecklistItemForm } from "../forms/checklist/AgregarChecklistItemForm";
import { exportChecklistPDF } from "@/lib/api/checklist";
import { EditarChecklistItemForm } from "../forms/checklist/EditarChecklistItemForm";
import { useUpdateStatus } from "@/hooks/checklist/useUpdateStatusChecklistItem";
import { useUpdatePlantillaItem } from "@/hooks/plantillas/useUpdatePlantillaItem";
import { Button } from "../ui/button";

import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Check,
    CirclePlus,
    Pencil,
    Share,
    Trash2,
    Loader2
} from "lucide-react";

interface ChecklistProps {
    idTrabajo: number;
    checklist: Checklist;
    onBack: () => void;
    isTemplate?: boolean;
}

const ChecklistComp = ({ checklist, onBack, isTemplate = false }: ChecklistProps) => {
    const [tasks, setTasks] = useState(checklist.tareas);
    const [activityToDelete, setActivityToDelete] = useState<Actividad | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activityToEdit, setActivityToEdit] = useState<Actividad | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Actualizar tareas si el checklist cambia
    useEffect(() => {
        setTasks(checklist.tareas || []);
    }, [checklist.tareas]);

    const safeTasks = tasks || [];
    const totalTasks = safeTasks.length;
    const completedTasks = safeTasks.filter(t => t.estado == "COMPLETADA").length;
    const pendingTasks = totalTasks - completedTasks;
    const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const { mutate: updateTask } = useUpdateStatus();
    const updatePlantillaMutation = useUpdatePlantillaItem();

    // Función para exportar como documento
    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Aseguramos que el loading se vea al menos 1 segundo para mejor UX
            const minTimePromise = new Promise(resolve => setTimeout(resolve, 1000));

            const [blob] = await Promise.all([
                exportChecklistPDF(checklist.id),
                minTimePromise
            ]);

            const url = window.URL.createObjectURL(blob as Blob);
            const link = document.createElement('a');
            link.href = url;
            const fileName = `${checklist.titulo.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '').replace(/\s+/g, '_')}_checklist.pdf`;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al exportar PDF:", error);
        } finally {
            setIsExporting(false);
        }
    };

    //Marcar o desmarcar tarea completada
    //Marcar o desmarcar tarea completada
    const toggleTask = (id: number) => {
        const taskToUpdate = tasks.find(t => t.id === id);
        if (!taskToUpdate) return;

        const newStatus = taskToUpdate.estado === "COMPLETADA" ? "PENDIENTE" : "COMPLETADA";

        setTasks(currentTasks =>
            currentTasks.map(task =>
                task.id === id ? { ...task, estado: newStatus } : task
            )
        );

        if (isTemplate) {
            updatePlantillaMutation.mutate({
                plantillaId: checklist.id,
                data: { ...taskToUpdate, estado: newStatus }
            });
        } else {
            updateTask({
                trabajoId: checklist.idTrabajo,
                checklistId: checklist.id,
                itemId: id,
            });
        }
    };

    //Eliminar tarea
    const handleDeleteClick = (task: Actividad) => {
        setActivityToDelete(task);
    };

    // Función para abrir el modal de edición
    const handleEditClick = (task: Actividad) => {
        setActivityToEdit(task); // Guardamos la tarea seleccionada en el estado
        setIsEditModalOpen(true); // Abrimos el modal
    };

    return (
        <div className="m-2">
            {/* HEADER CHECKLIST */}
            <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 m-2">
                <div className="items-center gap-1">
                    <div className="flex items-center gap-3 mb-1">
                        <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                            <ArrowLeft className="w-6 h-6 text-slate-600" />
                        </button>
                        <h1 className="text-2xl font-bold">{checklist.titulo}</h1>
                    </div>
                    <p className="text-slate-500 ml-10 font-medium">{checklist.ubicacion}</p>
                </div>

                <Button
                    className="bg-sidebar-border text-black hover:bg-gray-300"
                    onClick={handleExport}
                    disabled={isExporting}
                >
                    {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Share size={18} />}
                    <span>{isExporting ? "Exportando..." : "Exportar"}</span>
                </Button>
            </header>

            {/* PROGRESO */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 m-2">
                <div className="flex justify-between items-end mb-3">
                    <h2 className="text-lg font-semibold text-slate-800">Progreso del Mantenimiento</h2>
                    <span className={`text-sm font-bold ${completedTasks === totalTasks ? 'text-emerald-600' : 'text-emerald-500'}`}>
                        {completedTasks} de {totalTasks} completadas
                    </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </section>

            {/* LISTA */}
            <section className="m-2 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold ml-2">Lista de Actividades</h2>
                    <Button className="bg-gema-green hover:bg-green-700 text-white"
                        onClick={() => setIsAddModalOpen(true)}>
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Nueva Actividad
                    </Button>
                </div>

                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`group flex items-start gap-4 p-5 rounded-xl border transition-all duration-200 ${task.estado === 'COMPLETADA' ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 shadow-sm hover:border-emerald-200'}`}
                        >
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={`mt-1 shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${task.estado === 'COMPLETADA' ? 'bg-gema-green border-gema-green text-white' : 'bg-white border-slate-300 text-transparent hover:border-gema-green'}`}
                            >
                                <Check size={16} strokeWidth={3} />
                            </button>

                            <div className="grow cursor-pointer" onClick={() => toggleTask(task.id)}>
                                <h3 className={`font-semibold text-base mb-1 transition-colors ${task.estado === 'COMPLETADA' ? 'text-slate-400 line-through decoration-slate-400' : 'text-slate-800'}`}>
                                    {task.nombre}
                                </h3>
                                <p className={`text-sm ${task.estado === 'COMPLETADA' ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {task.descripcion}
                                </p>
                            </div>

                            <div className="flex items-center gap-1 transition-opacity">
                                <button
                                    onClick={() => handleEditClick(task)}
                                    className="inline-block p-1 border-2 border-gray-200 rounded-sm text-blue-500"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(task)}
                                    className="inline-block p-1 border-2 border-gray-200 rounded-sm text-gema-red"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && <div className="text-center py-10 text-slate-400 bg-white rounded-xl border border-dashed">No hay actividades.</div>}
                </div>
            </section>

            {/* FOOTER */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 mt-4 md:static md:bg-transparent md:border-none md:p-0">
                <div className="max-w-4xl mx-auto md:max-w-none flex flex-wrap justify-center gap-4 md:gap-6">
                    <Card label="Total" value={totalTasks} colorClass="text-gema-blue" />
                    <Card label="Completadas" value={completedTasks} colorClass="text-gema-green" />
                    <Card label="Pendientes" value={pendingTasks} colorClass="text-gema-red" />
                </div>
            </div>

            <AgregarChecklistItemForm
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                checklistId={checklist.id}
                isTemplate={isTemplate}
            />

            <EditarChecklistItemForm
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                actividad={activityToEdit}
                checklistId={checklist.id}
                isTemplate={isTemplate}
            />

            <EliminarChecklistItem
                actividad={activityToDelete}
                setActividad={setActivityToDelete}
                checklistId={checklist.id}
                onDelete={(id) => {
                }}
                isTemplate={isTemplate}
            />
        </div >
    )
}

export default ChecklistComp;