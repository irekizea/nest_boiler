import { PickType } from '@nestjs/swagger';
import { User } from '../../user/schemas/user.schema';

export class LoginRequestDto extends PickType(User, [
  'userEmail',
  'password',
] as const) {}
