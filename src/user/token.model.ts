import {JwtPayload, sign, verify} from "jsonwebtoken";
import { UserSchemaType } from "./user.model";

export interface ITokenVerify extends JwtPayload  {
  username?: string;
}

export class TokenModel {
  static generateAccessToken(username: string) {
    return sign({username}, process.env.JWT_SECRET, {expiresIn : "3d"});
  }

  static async verifyAccessToken(token: string) : Promise<ITokenVerify> {

    try {
      return verify(token, process.env.JWT_SECRET) as ITokenVerify;

    } catch (err) {
      return null;
    }
  }
}