import type { Actividad, Checklist } from "@/types/checklist.types";
import Card from "./card";
import { EliminarChecklistItem } from "../forms/checklist/EliminarChecklistItemForm";
import { AgregarChecklistItemForm } from "../forms/checklist/AgregarChecklistItemForm";
import { EditarChecklistItemForm } from "../forms/checklist/EditarChecklistItemForm";
import { Button } from "../ui/button";

import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Check,
    CirclePlus,
    Edit,
    Pencil,
    Share,
    Trash2
} from "lucide-react";

interface ChecklistProps {
    checklist: Checklist;
    onBack: () => void;
}

const ChecklistComp = ({ checklist, onBack }: ChecklistProps) => {
    const [tasks, setTasks] = useState(checklist.tareas);
    const [activityToDelete, setActivityToDelete] = useState<Actividad | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activityToEdit, setActivityToEdit] = useState<Actividad | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Actualizar tareas si el checklist cambia
    useEffect(() => {
        setTasks(checklist.tareas);
    }, [checklist.tareas]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.estado == "COMPLETADA").length;
    const pendingTasks = totalTasks - completedTasks;
    const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Función para exportar como documento
    const handleExport = () => {
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${checklist.titulo} - Checklist</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #1a1a1a; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
                    .ubicacion { color: #666; margin-bottom: 20px; }
                    .progreso { background: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                    .task { padding: 10px; border: 1px solid #ddd; margin-bottom: 8px; border-radius: 4px; }
                    .task.completada { background: #f0fdf4; border-color: #10b981; }
                    .task.pendiente { background: #fff; }
                    .task-name { font-weight: bold; }
                    .task-desc { color: #666; font-size: 14px; }
                    .status { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
                    .status.completada { background: #10b981; color: white; }
                    .status.pendiente { background: #f59e0b; color: white; }
                    .stats { display: flex; gap: 20px; margin-top: 20px; }
                    .stat { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; flex: 1; }
                    .stat-value { font-size: 24px; font-weight: bold; }
                    .stat-label { color: #666; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                </style>
            </head>
            <body>
                <h1>${checklist.titulo}</h1>
                <p class="ubicacion">📍 ${checklist.ubicacion}</p>
                
                <div class="progreso">
                    <strong>Progreso del Mantenimiento:</strong> ${completedTasks} de ${totalTasks} actividades completadas (${progressPercentage}%)
                </div>
                
                <h2>Lista de Actividades</h2>
                ${tasks.map(task => `
                    <div class="task ${task.estado === 'COMPLETADA' ? 'completada' : 'pendiente'}">
                        <span class="status ${task.estado === 'COMPLETADA' ? 'completada' : 'pendiente'}">
                            ${task.estado === 'COMPLETADA' ? '✓ Completada' : '○ Pendiente'}
                        </span>
                        <p class="task-name">${task.nombre}</p>
                        <p class="task-desc">${task.descripcion}</p>
                    </div>
                `).join('')}
                
                <div class="stats">
                    <div class="stat">
                        <div class="stat-value" style="color: #0ea5e9;">${totalTasks}</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" style="color: #10b981;">${completedTasks}</div>
                        <div class="stat-label">Completadas</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" style="color: #ef4444;">${pendingTasks}</div>
                        <div class="stat-label">Pendientes</div>
                    </div>
                </div>
                
                <p style="margin-top: 30px; color: #999; font-size: 12px;">
                    Generado el ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
        }

        // Crear un Blob con el contenido HTML para descarga
        const blob = new Blob([printContent], { type: 'text/html;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const fileName = `${checklist.titulo.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '').replace(/\s+/g, '_')}_checklist.html`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    //Marcar o desmarcar tarea completada
    const toggleTask = (id: number) => {
        setTasks(currentTasks =>
            currentTasks.map(task =>
                task.id === id ? { ...task, estado: task.estado === "COMPLETADA" ? "PENDIENTE" : "COMPLETADA" } : task
            )
        );
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
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold">{checklist.titulo}</h1>
                    </div>
                    <p className="text-slate-500 ml-10 font-medium">{checklist.ubicacion}</p>
                </div>

                <Button
                    className="bg-sidebar-border text-black hover:bg-gray-300"
                    onClick={handleExport}
                >
                    <Share size={18} />
                    <span>Exportar</span>
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
            />

            <EditarChecklistItemForm
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                actividad={activityToEdit}
            />

            <EliminarChecklistItem
                actividad={activityToDelete}
                setActividad={setActivityToDelete}
                onDelete={(id) => {
                    console.log("Elemento eliminado:", id);
                }}
            />
        </div>
    )
}

export default ChecklistComp;