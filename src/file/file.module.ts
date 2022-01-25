import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FileController } from "./file.controller";
import { FileSchema } from "./file.model";
import { FileService } from "./file.service";

@Module({
  imports: [MongooseModule.forFeature([
    {name : "File", schema : FileSchema}
  ])],
  controllers : [FileController],
  providers : [FileService]
})
export class FileModule {}