import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "./guards/auth.guard";
import { ITokenResponse } from "./types/token-response.interface";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("registration")
  @UsePipes(new ValidationPipe())
  async registration(@Body() createUserDto : CreateUserDto): Promise<CreateUserDto> {
    return this.userService.registration(createUserDto);
  }

  @Post("login")
  async login(@Body() CreateUserDto: CreateUserDto): Promise<ITokenResponse> {
    return this.userService.login(CreateUserDto);
  }
}