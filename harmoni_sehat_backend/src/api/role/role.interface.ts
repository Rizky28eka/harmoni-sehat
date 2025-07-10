import { Types } from 'mongoose';
import { IRole } from '../../models/Role';

export interface CreateRoleDto {
  nama_peran: string;
}

export interface UpdateRoleDto {
  nama_peran?: string;
}

export interface IRoleResponseDto {
  id: string;
  nama_peran: string;
}

export const toRoleResponseDto = (role: any): IRoleResponseDto => {
  return {
    id: role._id.toString(),
    nama_peran: role.nama_peran,
  };
};
