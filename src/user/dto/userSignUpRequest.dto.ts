import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserSignUpRequestDto {

  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  countryCode: number;

  @IsString()
  socialType: string;

  @IsString()
  socialKey: string;

  @IsBoolean()
  smsAllow: boolean;

  @IsBoolean()
  emailAllow: boolean;

}