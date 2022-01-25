import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserSchema & Document;

@Schema()
export class UserSchema {
  @Prop()
  username: string;

  @Prop()
  password: string;
}

export const CatSchema = SchemaFactory.createForClass(UserSchema);