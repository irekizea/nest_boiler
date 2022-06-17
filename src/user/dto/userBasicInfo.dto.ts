import { PickType } from "@nestjs/swagger";
import { User } from "src/user/schemas/user.shcema";

export class UserBasicInfoDto extends PickType(User, [
    'userEmail',
    'name',
    'coupone',
    'isSeller',
    'credit',
    'additionalCredit',
  ] as const) {}