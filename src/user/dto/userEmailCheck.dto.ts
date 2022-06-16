import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserEmailCheckDto {

  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

}