import { PickType } from '@nestjs/swagger';
import { User } from '../../user/schemas/user.schema';

export class LoginRequestDto extends PickType(User, [
  'userEmail',
  'password',
] as const) {}

// import { ApiProperty } from '@nestjs/swagger';
// import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
// export class LoginRequestDto {
//   @ApiProperty({
//     example: 'sample@croket.com',
//     description: '유저 이메일',
//   })
//   @IsEmail()
//   @IsNotEmpty()
//   userEmail: string;

//   @ApiProperty({
//     example: 'jklsdlf23slsdf',
//     description: '암호화 된 유저 비밀번호',
//   })
//   @IsString()
//   @IsNotEmpty()
//   password: string;
// }
