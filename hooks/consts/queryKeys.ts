export const QUERY_KEYS = {
    GRUPOS: ["gruposTrabajo"],
    CHECKLIST_ITEMS: ["checklistItems"],
    ACTIVIDADES: ["actividades"],
    RESUMEN_MANTENIMIENTOS: ["resumen-mantenimientos"],
    RESUMEN_MANTENIMIENTO: (id: number | string) => ["resumen-mantenimiento", id],
    MANTENIMIENTOS_INSPECCION: ["mantenimientosConInspeccion"],
};