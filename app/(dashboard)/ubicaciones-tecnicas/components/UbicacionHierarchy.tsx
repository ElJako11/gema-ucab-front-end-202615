import React from "react";
import type { UbicacionTecnica } from "@/types/models/ubicacionesTecnicas.types";
import { UbicacionRow } from "./UbicacionRow";

interface UbicacionHierarchyProps {
    ubicaciones: UbicacionTecnica[];
    onCreateFrom: (codigo: string) => void;
    onDelete: (detalle: UbicacionTecnica) => void;
    onViewDetails: (detalle: UbicacionTecnica | null) => void;
    onEdit: (detalle: UbicacionTecnica | null) => void;
    activeDetailItem: UbicacionTecnica | null;
}

export const UbicacionHierarchy: React.FC<UbicacionHierarchyProps> = ({
    ubicaciones,
    onCreateFrom,
    onDelete,
    onViewDetails,
    onEdit,
    activeDetailItem,
}) => {
    return (
        <>
            {ubicaciones.map((ubicacion) => {
                const isViewing =
                    activeDetailItem?.idUbicacion === ubicacion.idUbicacion;
                return (
                    <div key={ubicacion.idUbicacion}>
                        <UbicacionRow
                            ubicacion={ubicacion}
                            isViewing={isViewing}
                            onViewDetails={onViewDetails}
                            onCreateFrom={onCreateFrom}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                        {ubicacion.children && ubicacion.children.length > 0 && (
                            <UbicacionHierarchy
                                ubicaciones={ubicacion.children}
                                onCreateFrom={onCreateFrom}
                                onDelete={onDelete}
                                onViewDetails={onViewDetails}
                                onEdit={onEdit}
                                activeDetailItem={activeDetailItem}
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
};
