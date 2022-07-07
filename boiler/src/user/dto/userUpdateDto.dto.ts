import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/schemas/user.schema';

export class UserUpdateDto extends PickType(User, [
  'userEmail',
  'name',
] as const) {}
