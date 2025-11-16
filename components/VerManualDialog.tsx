'use client';

import { File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

export default function VerManualDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleVerGuia = () => {
    if (!isClient) return;
    
    // Método mejorado para descargar archivos en Next.js
    const link = document.createElement("a");
    link.href = "/guia-ubicaciones-tecnicas.pdf";
    link.download = "guia-ubicaciones-tecnicas.pdf";
    link.target = "_blank"; // Abrir en nueva pestaña
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Guardar en localStorage
    localStorage.setItem("haCargadoUbicaciones", "true");
    onOpenChange(false);
  };

  const handleContinuarSinLeer = () => {
    if (!isClient) return;
    
    localStorage.setItem("haCargadoUbicaciones", "true");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4 p-4">
          <p className="text-center text-sm">
            Antes de empezar, te recomendamos leer la guía de ubicaciones
            técnicas frecuentes
          </p>
          <div className="flex flex-col gap-3">
            <Button
              className="bg-gema-green hover:bg-green-700"
              onClick={handleVerGuia}
              disabled={!isClient}
            >
              <File className="mr-2 h-4 w-4" /> 
              Ver guía
            </Button>
            <Button
              variant="outline"
              onClick={handleContinuarSinLeer}
              disabled={!isClient}
            >
              Continuar sin leer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}