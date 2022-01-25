import { CreateFileDto } from "../dto/create-file.dto";

export type FileResponseType = Omit<CreateFileDto, "buffer">