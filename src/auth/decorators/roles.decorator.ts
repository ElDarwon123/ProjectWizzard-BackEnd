import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...role: RolesEnum[]) => SetMetadata(ROLES_KEY, role);
