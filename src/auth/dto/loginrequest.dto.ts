import { PickType } from "@nestjs/swagger";
import { User } from "src/user/schemas/user.shcema";

export class LoginRequestDto extends PickType(User, [
    'userEmail',
    'password'
] as const) {}