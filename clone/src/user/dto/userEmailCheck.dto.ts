import { PickType } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export class UserEmailCheckDto extends PickType(User, ['userEmail'] as const) {}
