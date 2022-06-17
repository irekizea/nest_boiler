import { PickType } from "@nestjs/swagger";
import { User } from "src/user/schemas/user.shcema";

export class UserEmailCheckDto extends PickType(User, [
  'userEmail',
] as const) {}