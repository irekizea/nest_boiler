import { PickType } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export class UserSignUpRequestDto extends PickType(User, [
  'userEmail',
  'password',
  'name',
] as const) {}
