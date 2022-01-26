import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "./file.service";
import { FileResponseType } from "./types/file-response.type";
import { User } from "src/user/decorators/user.decorator";
import { AuthGuard } from "src/user/guards/auth.guard";
import { IUserAuth } from "src/user/types/user-auth.interface";
import { UpdateFileDto } from "./dto/create-file.dto";
import { TokenModel } from "src/user/token.model";

@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post("upload")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@User() user : IUserAuth, @UploadedFile() file: Express.Multer.File) : Promise<FileResponseType> {
    console.log("FILE", file);
    return await this.fileService.upload(user, file);
  }

  @Get("download/:id/:token")
  async downloadFile(@Param("token") token : string, @Param("id") id : string, @Res({ passthrough: true }) res): Promise<StreamableFile> {
    if (!token) {
      throw new HttpException("Permission denied", HttpStatus.FORBIDDEN);
    } 

    const decoded = await TokenModel.verifyAccessToken(token);

    if (!decoded) {
      throw new HttpException("Permission denied", HttpStatus.FORBIDDEN);
    }

    const {mimeType, fileName, ext, buffer} = await this.fileService.download(decoded.username, id);

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${fileName}${ext}"`,
    });

    return new StreamableFile(buffer);
  }

  @Get("search/:filename")
  @UseGuards(AuthGuard)
  async searchFile(@User() user: IUserAuth, @Param("filename") filename): Promise<FileResponseType[]> {
    return await this.fileService.search(user, filename);
  }

  @Put("edit")
  @UseGuards(AuthGuard)
  async editFile(@User() user: IUserAuth, @Body() body: UpdateFileDto): Promise<FileResponseType> {
    return await this.fileService.editFile(user, body);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@User() user : IUserAuth): Promise<FileResponseType[]> {
    return this.fileService.findAll(user);
  }

  @Post("delete")
  @UseGuards(AuthGuard)
  async removeFile(@User() user: IUserAuth, @Body("id") id: string) {
    return await this.fileService.removeFile(user, id);
  }

}