import { IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(4)
  readonly username: string;

  @IsNotEmpty()
  @MinLength(4)
  readonly password: string;
}