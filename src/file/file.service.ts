import * as path from "path";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FileSchemaType } from "./file.model";
import { CreateFileDto, UpdateFileDto } from "./dto/create-file.dto";
import { FileResponseType } from "./types/file-response.type";
import { IUserAuth } from "src/user/types/user-auth.interface";

@Injectable()
export class FileService {
  constructor(@InjectModel("File") private readonly fileModel : Model<FileSchemaType>){}

  private getInfoFromFile(originalName: string) {
    const _randString = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);

    const customName: string = path.parse(originalName).name.replace(/\s/g, '');
    const fileName: string = customName + _randString;
    const extension: string = path.parse(originalName).ext;

    return {
      fileName,
      customName,
      extension
    }
  }

  async upload(user : IUserAuth, file : Express.Multer.File) :Promise<FileResponseType> {
    const { buffer, originalname, size, mimetype } = file;
    const { fileName, extension, customName } = this.getInfoFromFile(originalname);
    const { username } = user;

    const newFile : CreateFileDto = {
      buffer,
      ext: extension,
      fileName,
      username,
      allowed: false,
      size,
      customName,
      commited: false,
      mimeType : mimetype
    }

    const fileModel = new this.fileModel(newFile);
    await fileModel.save();
    
    return this.buildFileResposne(newFile);
  }

  async download(user : IUserAuth, id: string) : Promise<CreateFileDto> {
    try {
      const file = await this.fileModel.findById(id);

      if (user.username !== file.username) {
        throw new HttpException("You have not permission", HttpStatus.FORBIDDEN);
      }

      return file;

    } catch (err) {
      throw new HttpException("File doesn't exist or you have not permission", HttpStatus.NOT_FOUND);
    }
  }

  private buildFileResposne(newFile: CreateFileDto): FileResponseType {
    const newObj = Object.assign({}, newFile);
    delete newObj.buffer;

    return {
      ...newObj
    }
  }

  async search(user: IUserAuth, filename: string): Promise<FileResponseType[]> {
    const { username } = user;

    try {
      const results = await this.fileModel.find({ username });
      const filtredList = results.filter((item: CreateFileDto)  => {
        return item.customName.toLowerCase().indexOf(filename.toLowerCase()) > -1;
      });

      return filtredList.map((item : CreateFileDto ) => this._transformFileDto(item));

    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  private _transformFileDto(file: CreateFileDto) : FileResponseType{
    const {username, fileName, ext, allowed, size, customName, commited, mimeType} = file;
    return {
      username,
      fileName,
      ext,
      allowed,
      size,
      customName,
      commited,
      mimeType
    }
  }

  async editFile(user: IUserAuth, body: UpdateFileDto): Promise<FileResponseType> {
    try {
      const file = await this.fileModel.findById(body.id);

      if (file.username !== user.username) {
        throw new HttpException("File doesn't belong to you", HttpStatus.FORBIDDEN);
      }

      Object.assign(file, body);
      return this._transformFileDto(file);

    } catch (err) {
      throw new HttpException("Error Occurred", HttpStatus.BAD_GATEWAY);
    }
  }
}