import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { User } from "./decorators/user.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "./guards/auth.guard";
import { ITokenResponse } from "./types/token-response.interface";
import { IUserAuth } from "./types/user-auth.interface";
import { UserResponseType } from "./types/user-response.type";
import { ICheckUser, UserService } from "./user.service";
import { Request } from "express";

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

  @Get("logout")
  @UseGuards(AuthGuard)
  async logout(@User() user: IUserAuth): Promise<{message : string}> {
    return await this.userService.logout(user.username);
  }

  @Get("check")
  @UseGuards(AuthGuard)
  async checkToken(@Req() req : Request): Promise<ICheckUser> {
    const token = req.headers?.authorization.split(" ")[1];

    return await this.userService.checkToken(token);
  }
}