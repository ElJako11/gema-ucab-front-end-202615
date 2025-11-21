import { UbicacionTecnica } from "@/types/models/ubicacionesTecnicas.types";

export const mockUbicaciones: UbicacionTecnica[] = [
    {
        idUbicacion: 1,
        descripcion: "Planta Principal",
        abreviacion: "PP",
        codigo_Identificacion: "PP",
        nivel: 1,
        children: [
            {
                idUbicacion: 2,
                descripcion: "Edificio Administrativo",
                abreviacion: "ADM",
                codigo_Identificacion: "PP-ADM",
                nivel: 2,
                children: [
                    {
                        idUbicacion: 3,
                        descripcion: "Oficina Gerencia",
                        abreviacion: "GER",
                        codigo_Identificacion: "PP-ADM-GER",
                        nivel: 3,
                        children: []
                    },
                    {
                        idUbicacion: 4,
                        descripcion: "Sala de Reuniones",
                        abreviacion: "REU",
                        codigo_Identificacion: "PP-ADM-REU",
                        nivel: 3,
                        children: []
                    }
                ]
            },
            {
                idUbicacion: 5,
                descripcion: "Nave Industrial A",
                abreviacion: "NAV-A",
                codigo_Identificacion: "PP-NAV-A",
                nivel: 2,
                children: [
                    {
                        idUbicacion: 6,
                        descripcion: "Línea de Producción 1",
                        abreviacion: "LIN-1",
                        codigo_Identificacion: "PP-NAV-A-LIN-1",
                        nivel: 3,
                        children: []
                    }
                ]
            }
        ]
    }
];
