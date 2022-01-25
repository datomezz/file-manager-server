
export class CreateFileDto {
  readonly username? : string;
  buffer : any;
  readonly fileName : string;
  readonly ext : string;
  allowed?: boolean;
  readonly size: number;
  customName: string;
  commited: boolean;
  readonly mimeType: string;
}

export class UpdateFileDto {
  id: string;
  commited?: string;
  customName?: string;
  allowed?: string;
}