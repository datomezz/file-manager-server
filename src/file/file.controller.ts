import { Body, Controller, Get, Param, Post, Put, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "./file.service";
import { FileResponseType } from "./types/file-response.type";
import { User } from "src/user/decorators/user.decorator";
import { AuthGuard } from "src/user/guards/auth.guard";
import { IUserAuth } from "src/user/types/user-auth.interface";
import { UpdateFileDto } from "./dto/create-file.dto";

@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post("upload")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@User() user : IUserAuth, @UploadedFile() file: Express.Multer.File) : Promise<FileResponseType> {
    return await this.fileService.upload(user, file);
  }

  @Get("download/:id")
  @UseGuards(AuthGuard)
  async downloadFile(@User() user : IUserAuth, @Param("id") id : any, @Res({ passthrough: true }) res): Promise<StreamableFile> {
    const {mimeType, fileName, ext, buffer} = await this.fileService.download(user, id);

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

}