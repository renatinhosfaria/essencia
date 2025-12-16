import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type Role =
  | 'admin'
  | 'coordinator'
  | 'secretary'
  | 'teacher'
  | 'guardian'
  | 'guardian_primary'
  | 'guardian_secondary';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
