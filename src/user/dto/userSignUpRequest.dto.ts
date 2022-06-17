import { PickType } from "@nestjs/swagger";
import { User } from "src/user/schemas/user.shcema";


export class UserSignUpRequestDto extends PickType(User, [
  'userEmail',
  'password',
  'name',
  'countryCode',
  'socialType',
  'socialKey',
  'smsAllow',
  'emailAllow'
] as const) {}