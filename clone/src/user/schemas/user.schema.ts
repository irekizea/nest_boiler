import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class User extends Document {
  @ApiProperty({
    example: 'jklsdlf23slsdf',
    description: '유저 고유 번호',
  })
  @Prop({ default: Types.ObjectId })
  _id: Types.ObjectId;

  @ApiProperty({
    example: 'sample@croket.com',
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
    example: '크로켓',
    description: '유저 이름',
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '82',
    description: '유저 국가번호',
  })
  @Prop()
  @IsNotEmpty()
  countryCode: number;

  @ApiProperty({
    example: '[3, 5, 11]',
    description: '쿠폰 아이디가 담긴 보유 쿠폰 리스트',
    default: '[]',
  })
  @Prop({ default: [] })
  @IsString()
  coupone: [];

  @ApiProperty({
    example: 'true',
    description: '셀러 여부',
  })
  @Prop({ default: false })
  @IsBoolean()
  isSeller: boolean;

  @ApiProperty({
    example: '유럽셀러',
    description: '셀러 아이디',
    default: 'null',
  })
  @Prop({ default: null })
  @IsString()
  sellerName: string;

  @ApiProperty({
    example: '신한은행',
    description: '셀러 계좌 은행',
    default: 'null',
  })
  @Prop({ default: null })
  @IsString()
  bank: string;

  @ApiProperty({
    example: '234234-11231235-2342',
    description: '셀러 계좌번호',
    default: 'null',
  })
  @Prop({ default: null })
  @IsString()
  accountNumber: string;

  @ApiProperty({
    example: '01000000000',
    description: '2차 연락 수단',
    default: 'null',
  })
  @Prop({ default: null })
  @Prop()
  @IsString()
  anotherContactNum: string;

  @ApiProperty({
    example: 'starter',
    description: '회원 vip 등급',
    default: 'start',
  })
  @Prop({ default: 'start' })
  @IsString()
  grade: string;

  @ApiProperty({
    example: '21323',
    description: '보유 크래딧',
    default: '0',
  })
  @Prop({ default: 0 })
  @IsNumber()
  credit: number;

  @ApiProperty({
    example: '21323',
    description: '추가 적립가능 크래딧',
    default: '0',
  })
  @Prop({ default: 0 })
  @IsNumber()
  additionalCredit: number;

  @ApiProperty({
    example: 'kakao',
    description: '소셜 로그인 타입',
  })
  @Prop()
  @IsString()
  socialType: string;

  @ApiProperty({
    example: 'wejlksdlkjl2341sdf',
    description: '소셜 로그인 키',
  })
  @Prop()
  @IsString()
  socialKey: string;

  @ApiProperty({
    example: 'true',
    description: 'sms 동의 여부',
  })
  @Prop()
  @IsBoolean()
  smsAllow: boolean;

  @ApiProperty({
    example: 'true',
    description: 'email 수신 동의 여부',
  })
  @IsBoolean()
  emailAllow: boolean;

  @ApiProperty({
    example: '[12asdfas214, 324asetw45]',
    description: '찜 상품 id 리스트',
  })
  @Prop({ default: [] })
  @IsArray()
  likeList: [];

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
    coupone: string;
    isSeller: boolean;
    grade: string;
    credit: number;
    additionalCredit: number;
  };

  readonly basicInfoData: {
    userEmail: string;
    name: string;
    coupone: string;
    isSeller: boolean;
    grade: string;
    credit: number;
    additionalCredit: number;
  };

  readonly sellerInfoData: {
    sellerName: string;
    bank: string;
    accountNumber: string;
    anotherContactNum: string;
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
    coupone: this.coupone,
    isSeller: this.isSeller,
    grade: this.grade,
    credit: this.credit,
    additionalCredit: this.additionalCredit,
  };
});

UserSchema.virtual('sellerInfoData').get(function (this: User) {
  return {
    sellerName: this.sellerName,
    bank: this.bank,
    accountNumber: this.accountNumber,
    anotherContactNum: this.anotherContactNum,
  };
});
