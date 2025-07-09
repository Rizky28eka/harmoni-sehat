import { Request, Response, NextFunction } from 'express';
import RoleService from './role.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toRoleResponseDto } from './role.interface';
import { CreateRoleInput, UpdateRoleInput } from './role.validation';

class RoleController {
  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleData: CreateRoleInput = req.body;
      const newRole = await RoleService.createRole(roleData);
      res.status(201).json(new ApiResponse(201, toRoleResponseDto(newRole), 'Role created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await RoleService.getAllRoles();
      res.status(200).json(new ApiResponse(200, roles.map(toRoleResponseDto), 'Roles fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getRoleById(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await RoleService.getRoleById(req.params.id);
      res.status(200).json(new ApiResponse(200, toRoleResponseDto(role!), 'Role fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleData: UpdateRoleInput = req.body;
      const roleId = req.params.id;
      const updatedRole = await RoleService.updateRole(roleId, roleData);
      res.status(200).json(new ApiResponse(200, toRoleResponseDto(updatedRole!), 'Role updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = req.params.id;
      await RoleService.deleteRole(roleId);
      res.status(204).json(new ApiResponse(204, null, 'Role deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new RoleController();
