import { SetMetadata } from '@nestjs/common';
import { ROL } from 'src/users/enum/users.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ROL[]) => {
  return SetMetadata(META_ROLES, args);
};
