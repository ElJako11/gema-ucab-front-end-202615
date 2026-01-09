import { tecnicosAPI } from "./tecnicos";
import type { Tecnico } from "@/types/tecnicos.types";

export interface AsignacionGrupoItem {
	grupoDeTrabajoId: number;
	usuarios: Tecnico[];
}

export interface AsignacionGrupoResponse {
	data: AsignacionGrupoItem[];
}

export interface AsignacionGrupoEspecificoResponse {
	data: AsignacionGrupoItem;
}

export interface CreateAsignacionRequest {
	tecnicoId: number;
	grupoDeTrabajoId: number;
}

function groupTecnicosByGrupo(tecnicos: Tecnico[]): AsignacionGrupoItem[] {
	const map = new Map<number, Tecnico[]>();
	for (const t of tecnicos) {
		const grupoId = (t.idGT ?? t.idGrupo) as number | undefined;
		if (grupoId === undefined || grupoId === null) continue;
		if (!map.has(grupoId)) map.set(grupoId, []);
		map.get(grupoId)!.push(t);
	}
	return Array.from(map.entries()).map(([grupoDeTrabajoId, usuarios]) => ({
		grupoDeTrabajoId,
		usuarios,
	}));
}

export const asignacionGruposAPI = {
	async getAll(): Promise<AsignacionGrupoResponse> {
		const resp = await tecnicosAPI.getAll();
		const data = groupTecnicosByGrupo(resp.data);
		return { data };
	},

	async getByGrupoId(grupoId: number): Promise<AsignacionGrupoEspecificoResponse> {
		const resp = await tecnicosAPI.getAll();
		const usuarios = resp.data.filter((t) => (t.idGT ?? t.idGrupo) === grupoId);
		return { data: { grupoDeTrabajoId: grupoId, usuarios } };
	},

	async create(req: CreateAsignacionRequest): Promise<void> {
		const { tecnicoId, grupoDeTrabajoId } = req;
		await tecnicosAPI.update({ idTecnico: tecnicoId, idGT: grupoDeTrabajoId } as Tecnico);
	},

	async delete(asignacionId: number): Promise<void> {
		// Interpretar asignacionId como idTecnico y desasignar del grupo
		await tecnicosAPI.update({ idTecnico: asignacionId, idGT: null as unknown as number } as Tecnico);
	},

	async deleteByTecnicoAndGrupo(tecnicoId: number, _grupoId: number): Promise<void> {
		// El backend ahora infiere la desasignación al poner idGT en null/0
		await tecnicosAPI.update({ idTecnico: tecnicoId, idGT: null as unknown as number } as Tecnico);
	},
};

