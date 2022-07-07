import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class User extends Document {
  @ApiProperty({
    example: 'sample@boiler.com',
    description: '유저 이메일',
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty({
    example: 'jklsdlf23slsdf',
    description: '암호화 된 유저 비밀번호',
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '보일러',
    description: '유저 이름',
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'wejlksdlkjl2341sdf',
    description: 'access jwt 키',
  })
  @Prop()
  @IsString()
  accessToken: string;

  @ApiProperty({
    example: 'wejlksdlkjl2341sdf',
    description: 'accesstoken refresh jwt 키',
  })
  @Prop()
  @IsString()
  refreshToken: string;

  readonly readOnlyData: {
    userEmail: string;
    name: string;
  };

  readonly basicInfoData: {
    userEmail: string;
    name: string;
    accessToken: string;
    refreshToken: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    userEmail: this.userEmail,
    name: this.name,
  };
});

UserSchema.virtual('basicInfoData').get(function (this: User) {
  return {
    userEmail: this.userEmail,
    name: this.name,
    accessToken: this.accessToken,
    refreshToken: this.refreshToken,
  };
});
