import { CreateUserDto } from "../dto/create-user.dto";

export type UserResponseType = Omit<CreateUserDto, "password">