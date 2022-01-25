import { Model, Connection } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { CreateUserDto } from "./dto/create-user.dto";
import { hashSync, compareSync } from 'bcryptjs';
import { UserSchema, UserSchemaType, IUser } from './user.model';
import { TokenModel } from './token.model';
import { JwtPayload } from 'jsonwebtoken';
import { ITokenResponse } from './types/token-response.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel("User") private userModel: Model<UserSchemaType>) { }

  async registration(createUserDto: CreateUserDto): Promise<UserSchemaType> {
    const { username, password } = createUserDto;
    const checkUsername = await this.userModel.findOne({ username });

    if (checkUsername) {
      throw new HttpException("User Already exist", HttpStatus.FORBIDDEN);
    }

    const hashedPassword = hashSync(password, 10);

    const token = TokenModel.generateAccessToken(username);

    const newUser : IUser = {
      username: createUserDto.username,
      password: hashedPassword,
      token,
    }

    const createdUser = new this.userModel(newUser);
    return await createdUser.save();
  }

  async login(createUserDto: CreateUserDto): Promise<ITokenResponse> {
    const { username, password } = createUserDto;

    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new HttpException("User Doesn't exist", HttpStatus.NOT_FOUND);
    }

    const checkPassword = compareSync(password, user.password);

    if (!checkPassword) {
      throw new HttpException("Wrong password", HttpStatus.FORBIDDEN);
    }

    const token = TokenModel.generateAccessToken(username);
    await this.userModel.updateOne({ username }, { token });

    return {token};
  }

  async findUserByName(username: string | JwtPayload) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      return null;
    }

    return user;
  }

}
