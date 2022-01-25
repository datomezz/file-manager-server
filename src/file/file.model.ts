import { Schema, Document } from "mongoose";

export const FileSchema = new Schema({
  username: { type: String },
  buffer: { type: Buffer, required: true },
  fileName: { type: String, required: true },
  ext: { type: String, required: true },
  allowed: { type: Boolean },
  size: { type: Number, required: true },
  customName: { type: String, required: true },
  commited: { type: Boolean, required: true },
  mimeType : {type : String, required : true}
});

export type FileSchemaType = IFile & Document;

export interface IFile {
  username?: string;
  buffer: any;
  fileName: string;
  ext: string;
  allowed?: boolean;
  size: number;
  customName: string;
  commited: boolean;
  mimeType: string;
}