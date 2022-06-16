import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop({ required: true, unique: true })
  userEmail: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  countryCode: string;

  @Prop()
  coupone: string;

  @Prop({ default: false})
  isSeller: string;

  @Prop({ default: "start"})
  grade: string;

  @Prop({ default: 0 })
  credit: number;

  @Prop()
  socialType: string;

  @Prop()
  socialKey: string;

  @Prop()
  smsAllow: string;

  @Prop()
  emailAllow: string;

}

export const TodoSchema = SchemaFactory.createForClass(User);