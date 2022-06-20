import { PickType } from "@nestjs/swagger";
import { User } from "src/user/schemas/user.schema";

export class GetNewAccessToken extends PickType(User, [
    'userEmail',
    'accessToken',
  ] as const) {}