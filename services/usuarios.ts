'use client'
import { apiClient } from '@/lib/api/client';
import { Usuarios, Usuario } from '@/types/usuarios.types';

export type UsuarioResponse = {
  id?: number;
  nombre: string;
  correo: string;
  tipo: 'SUPERVISOR' | 'COORDINADOR' | 'DIRECTOR';
  contraseña: string;
};

const normalizeUsuario = (
  data?: UsuarioResponse | null
): Usuario | null => {
  if (!data) {
    return null;
  }

  const anyData = data as any;
  return {
    id: data.id || anyData.Id,
    nombre: data.nombre || anyData.Nombre,
    correo: data.correo || anyData.Correo,
    tipo: data.tipo || anyData.Tipo,
    contraseña: data.contraseña || anyData.Contraseña,
  };
};

export const fetchUsuarios = async (): Promise<Usuarios> => {
  const response = await apiClient.get<UsuarioResponse[]>('/usuarios');

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map((item) => normalizeUsuario(item)).filter((item): item is Usuario => item !== null);
};

export const getUsuario = async (id: number): Promise<Usuario | null> => {
  const response = await apiClient.get<UsuarioResponse>(`/usuarios/${id}`);

  return normalizeUsuario(response);
};

export const crearUsuario = async (params: UsuarioResponse): Promise<Usuario | null> => {
  const response = await apiClient.post<UsuarioResponse>('/usuarios', params);

  return normalizeUsuario(response);
};

export const editUsuario = async (id: number, user: UsuarioResponse): Promise<Usuario | null> => {
  const response = await apiClient.patch<UsuarioResponse>(`/usuarios/${id}`, user);

  return normalizeUsuario(response);
};

export const deleteUsuario = async (id: number): Promise<void> => {
  return await apiClient.delete<void>(`/usuarios/${id}`);

};
