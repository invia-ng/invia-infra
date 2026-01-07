/* eslint-disable prettier/prettier */

import { SetMetadata } from '@nestjs/common';
import { AccountRole } from '../constants/enums';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: AccountRole[]) => SetMetadata(ROLES_KEY, roles);
