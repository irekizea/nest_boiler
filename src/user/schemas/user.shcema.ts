import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

const options: SchemaOptions =  {
  timestamps: true,
}

@Schema(options)
export class User {

  @Prop({ 
    required: true, 
    unique: true 
  })
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop()
  @IsNotEmpty()
  countryCode: number;

  @Prop()
  @IsString()
  coupone: string;

  @Prop({ default: false})
  @IsString()
  isSeller: string;

  @Prop({ default: "start"})
  @IsString()
  grade: string;

  @Prop({ default: 0 })
  @IsNumber()
  credit: number;

  @Prop()
  @IsString()
  socialType: string;

  @Prop()
  @IsString()
  socialKey: string;

  @Prop()
  @IsBoolean()
  smsAllow: boolean;

  @IsBoolean()
  emailAllow: boolean;

  readonly readOnlyData:{
    userEmail: string;
    name: string
  }

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('readOnlyData').get(function (this: User){
  return {
    userEmail: this.userEmail,
    name: this.name,
  }
})