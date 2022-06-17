import { PickType } from "@nestjs/swagger";
import { User } from "src/user/schemas/user.shcema";

export class RegistSellerDto extends PickType(User, [
    'userEmail',
    'sellerName',
    'bank',
    'accountNumber',
    'anotherContactNum',
  ] as const) {}