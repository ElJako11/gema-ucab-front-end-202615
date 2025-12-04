import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { NIVELES, type Filters, type Nivel } from "./constants";
import type { UbicacionTecnica } from "@/types/models/ubicacionesTecnicas.types";

interface UbicacionesFiltersProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    flatUbicaciones: UbicacionTecnica[];
}

export const UbicacionesFilters: React.FC<UbicacionesFiltersProps> = ({
    filters,
    setFilters,
    flatUbicaciones,
}) => {
    const getOptions = (nivel: Nivel, prevFilters: Filters) => {
        let ubicaciones = flatUbicaciones;
        for (let i = 0; i < NIVELES.length; i++) {
            const n = NIVELES[i];
            if (n === nivel) break;
            if (prevFilters[n as Nivel]) {
                ubicaciones = ubicaciones.filter(
                    (u) =>
                        (u.codigo_Identificacion.split("-")[i] || "") ===
                        prevFilters[n as Nivel]
                );
            }
        }
        const idx = NIVELES.indexOf(nivel as (typeof NIVELES)[number]);
        return Array.from(
            new Set(
                ubicaciones.map((u) => u.codigo_Identificacion.split("-")[idx] || "")
            )
        ).filter(Boolean);
    };

    if (flatUbicaciones.length === 0) return null;

    return (
        <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
                Filtrar por niveles:
            </p>
            <div className="flex flex-wrap gap-3    ">
                {NIVELES.map((nivel, idx) => {
                    if (idx > 0 && !filters[NIVELES[idx - 1]]) return null;
                    const opciones = getOptions(nivel, filters);
                    if (!opciones.length) return null;
                    return (
                        <Select

                            value={filters[nivel]}
                            key={nivel}
                            onValueChange={(value) => {
                                setFilters((prev) => {
                                    const updated = { ...prev };
                                    updated[nivel] = value;
                                    for (let i = idx + 1; i < NIVELES.length; i++)
                                        updated[NIVELES[i]] = "";
                                    return updated;
                                });
                            }}
                        >
                            <SelectTrigger className="bg-white w-40">
                                <SelectValue placeholder={`Nivel ${idx + 1}`} />
                            </SelectTrigger>
                            <SelectContent className="bg-white ">
                                {opciones.map((op) => (
                                    <SelectItem
                                        className="hover:bg-gray-100"
                                        key={op} value={op}>
                                        {op}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    );
                })}
                {Object.values(filters).some(Boolean) && (
                    <Button
                        variant="outline"
                        onClick={() =>
                            setFilters({
                                modulo: "",
                                planta: "",
                                espacio: "",
                                tipo: "",
                                subtipo: "",
                                numero: "",
                                pieza: "",
                            })
                        }
                    >
                        Limpiar filtros
                    </Button>
                )}
            </div>
        </div>
    );
};
