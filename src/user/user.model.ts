import {Schema, Document} from "mongoose";

export const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  token : {type : String}
});

export type UserSchemaType = IUser & Document;

export interface IUser {
  username: string;
  password: string;
  token: string;
} 