'use client';

import { MonthlyCalendar } from "@/components/ui/monthlyCalendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { 
    CirclePlus, 
    FileText, 
    Calendar
} from "lucide-react";

const Calendario = () => {
    return (
        <div className="p-6 max-w-7.5xl">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
                <div className="items-center gap-1">
                    <h1 className="text-2xl font-bold">Calendario de Mantenimiento e Inspecciones</h1>
                    <h2 className="text-lg text-gray-500">Gestiona los mantenimientos preventivos e inspecciones programados por semana</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Dialog /*open={open} onOpenChange={setOpen}*/>
                        <DialogTrigger asChild>
                            <Button className="bg-sidebar-border text-black hover:bg-gray-300">
                            <Calendar className="mr-2 h-4 w-4" />
                            Vista Semanal
                            </Button>
                        </DialogTrigger>
                        {/*Accion a ejecutar al presionar el boton*/}
                    </Dialog>
                    <Dialog /*open={open} onOpenChange={setOpen}*/>
                        <DialogTrigger asChild>
                            <Button className="bg-gema-blue hover:bg-blue-700">
                            <FileText className="mr-2 h-4 w-4" />
                            Resumen Mensual
                            </Button>
                        </DialogTrigger>
                        {/*Accion a ejecutar al presionar el boton*/}
                    </Dialog>
                    <Dialog /*open={open} onOpenChange={setOpen}*/>
                        <DialogTrigger asChild>
                            <Button className="bg-gema-green hover:bg-green-700">
                            <CirclePlus className="mr-2 h-4 w-4" />
                            Nuevo Elemento
                            </Button>
                        </DialogTrigger>
                        {/*Accion a ejecutar al presionar el boton*/}
                    </Dialog>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                {/**Calendario */}
                <MonthlyCalendar />
            </div>
        </div>
    )
}

export default Calendario;